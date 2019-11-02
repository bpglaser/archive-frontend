import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";
import React from "react";
import { Backend } from "../../Data/Backend";
import { User } from "../../Models/User";
import { validUsername } from "../../Helpers";

enum Validation {
  Undetermined,
  Invalid,
  Valid,
}

interface PasswordFieldProps {
  label: string;
  superRef: React.RefObject<HTMLInputElement>;
  onInput: React.FormEventHandler<HTMLInputElement>;
  validation: Validation;
}

const PasswordField: React.FC<PasswordFieldProps> =
  ({ label, superRef: ref, onInput, validation }) => {
    let divClassName = "control has-icons-left";
    let inputClassName = "input";

    if (validation === Validation.Invalid) {
      inputClassName += " is-danger";
      divClassName += " has-icons-right";
    }

    return (<div className="field">
      <label className="label">{label}</label>

      <div className={divClassName}>
        <input
          className={inputClassName}
          type="password"
          placeholder={label}
          ref={ref}
          onInput={onInput} />

        <span className="icon is-small is-left">
          <i className="fas fa-lock"></i>
        </span>

        {validation === Validation.Invalid &&
          <div>
            <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
            <p className="help is-danger">Passwords must match!</p>
          </div>
        }
      </div>
    </div>)
  }

interface Props {
  backend: Backend;
  displayError: (errorMessage: string) => void;
  token: string;
  user: User;
  updateLogin: (user: User, token: string) => void;
}

interface State {
  awaitingUpdateResponse: boolean;
  awaitingUsernameResponse: boolean;
  displayMessage: string | null;
  displayMessageClassNameSuffix: string;
  username: string;
  usernameButtonDisabled: boolean;
  validation: Validation;
}

export default class AccountSettings extends React.Component<Props, State> {
  oldPasswordField: React.RefObject<HTMLInputElement>
  newPasswordField: React.RefObject<HTMLInputElement>
  confirmNewPasswordField: React.RefObject<HTMLInputElement>

  constructor(props: Props) {
    super(props)

    this.oldPasswordField = React.createRef();
    this.newPasswordField = React.createRef();
    this.confirmNewPasswordField = React.createRef();

    this.state = {
      awaitingUpdateResponse: false,
      awaitingUsernameResponse: false,
      displayMessage: null,
      displayMessageClassNameSuffix: "",
      username: this.props.user.email, // TODO change to username
      usernameButtonDisabled: true,
      validation: Validation.Undetermined,
    };
  }

  render() {
    return (<div className="account-settings">
      <h3 className="title is-4">Update Username</h3>

      <div className="field">
        <label className="label">Update Username</label>
        <input
          className="input"
          type="text"
          placeholder="Username"
          onChange={this.usernameOnChange}
          value={this.state.username}
        />
      </div>

      <button
        className={this.state.awaitingUsernameResponse ? "button is-success is-loading" : "button is-success"}
        disabled={this.state.usernameButtonDisabled}
        onClick={this.setUsername}
      >
        Set Username
      </button>

      <br />
      <br />

      <h3 className="title is-4">Update Password</h3>

      <div className="field">
        <label className="label">Old Password</label>

        <div className="control has-icons-left">
          <input
            className="input"
            type="password"
            placeholder="Old Password"
            ref={this.oldPasswordField} />

          <span className="icon is-small is-left">
            <i className="fas fa-lock"></i>
          </span>
        </div>
      </div>

      <PasswordField
        label="New Password"
        superRef={this.newPasswordField}
        onInput={this.newPasswordUpdated}
        validation={Validation.Valid} />

      <PasswordField
        label="Confirm New Password"
        superRef={this.confirmNewPasswordField}
        onInput={this.newPasswordUpdated}
        validation={this.state.validation} />

      <button
        className={this.state.awaitingUpdateResponse ? "button is-success is-loading" : "button is-success"}
        disabled={this.state.awaitingUpdateResponse || this.state.validation !== Validation.Valid}
        onClick={this.updateButtonOnClick}>
        Update
      </button>

      {this.state.displayMessage !== null &&
        <p className={"help" + this.state.displayMessageClassNameSuffix}>{this.state.displayMessage}</p>
      }
    </div>)
  }

  validateNewPasswordFields = () => {
    return (this.newPasswordField.current !== null
      && this.confirmNewPasswordField.current !== null
      && this.newPasswordField.current.value === this.confirmNewPasswordField.current.value);
  }

  newPasswordUpdated = (event: React.FormEvent<HTMLInputElement>) => {
    if (this.validateNewPasswordFields()) {
      this.setState({
        validation: Validation.Valid
      });
    } else {
      this.setState({
        validation: Validation.Invalid
      });
    }
  }

  clearPasswordFields = () => {
    if (this.oldPasswordField.current !== null)
      this.oldPasswordField.current.value = "";
    if (this.newPasswordField.current !== null)
      this.newPasswordField.current.value = "";
    if (this.confirmNewPasswordField.current !== null)
      this.confirmNewPasswordField.current.value = "";
    this.setState({ validation: Validation.Undetermined });
  }

  updateButtonOnClick = async (event: React.FormEvent<HTMLButtonElement>) => {
    if (!this.validateNewPasswordFields()) {
      return;
    }

    const oldPassword = this.oldPasswordField.current!.value;
    const newPassword = this.newPasswordField.current!.value;

    this.setState({
      awaitingUpdateResponse: true,
    });

    try {
      await this.props.backend.updatePassword(this.props.token, oldPassword, newPassword);

      this.clearPasswordFields();

      this.setState({
        displayMessage: "Password updated successfully!",
        displayMessageClassNameSuffix: " is-success",
      });
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case BAD_REQUEST:
            // The token is invalid
            // TODO redirect to home and logout
            break;
          case INTERNAL_SERVER_ERROR:
            // TODO
            break;
          case UNAUTHORIZED:
            // Wrong old password
            this.setState({
              displayMessage: 'Old password incorrect.',
              displayMessageClassNameSuffix: ' is-danger',
            });
            this.clearPasswordFields();
            return;
        }
      }

      console.log('Error encountered while updating password: ' + err);
      this.setState({
        displayMessage: 'An error was encountered.',
        displayMessageClassNameSuffix: ' is-danger',
      });
    } finally {
      this.setState({
        awaitingUpdateResponse: false,
      });
    }
  }

  usernameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;
    this.setState({
      username: username,
      usernameButtonDisabled: !validUsername(username),
    });
  }

  setUsername = async () => {
    if (this.state.usernameButtonDisabled) {
      return;
    }

    this.setState({
      awaitingUsernameResponse: true,
      usernameButtonDisabled: true,
    });

    try {
      const { user, token } = await this.props.backend.updateUsername(this.props.token, this.state.username);
      this.props.updateLogin(user, token);
    } catch (err) {
      console.log(err);
      this.props.displayError('Error encountered while updating username.');
    }

    this.setState({
      awaitingUsernameResponse: false,
      usernameButtonDisabled: false,
    });
  }
}
