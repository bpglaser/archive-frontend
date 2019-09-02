import React from "react";
import { delay } from "q";

enum Validation {
  Undetermined,
  Invalid,
  Valid,
}

type PasswordFieldProps = {
  label: string,
  superRef: React.RefObject<HTMLInputElement>,
  onInput: React.FormEventHandler<HTMLInputElement>,
  validation: Validation,
}

const PasswordField: React.FC<PasswordFieldProps> =
  ({ label, superRef: ref, onInput, validation }) => {
    let divClassName = "control has-icons-left"
    let inputClassName = "input"
    if (validation === Validation.Invalid) {
      inputClassName += " is-danger"
      divClassName += " has-icons-right"
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

type State = {
  awaitingUpdateResponse: boolean,
  displayMessage: string | null,
  displayMessageClassNameSuffix: string,
  validation: Validation,
}

export default class AccountSettings extends React.Component<any, State> {
  oldPasswordField: React.RefObject<HTMLInputElement>
  newPasswordField: React.RefObject<HTMLInputElement>
  confirmNewPasswordField: React.RefObject<HTMLInputElement>

  constructor(props: any) {
    super(props)
    this.oldPasswordField = React.createRef()
    this.newPasswordField = React.createRef()
    this.confirmNewPasswordField = React.createRef()
    this.state = {
      awaitingUpdateResponse: false,
      displayMessage: null,
      displayMessageClassNameSuffix: "",
      validation: Validation.Undetermined,
    }
  }

  render() {
    return (<div style={{ maxWidth: "30em" }}>
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
    return (this.newPasswordField.current != null
      && this.confirmNewPasswordField.current != null
      && this.newPasswordField.current.value === this.confirmNewPasswordField.current.value)
  }

  newPasswordUpdated = (event: React.FormEvent<HTMLInputElement>) => {
    if (this.validateNewPasswordFields()) {
      this.setState({
        validation: Validation.Valid
      })
    } else {
      this.setState({
        validation: Validation.Invalid
      })
    }
  }

  updateButtonOnClick = async (event: React.FormEvent<HTMLButtonElement>) => {
    this.setState({
      awaitingUpdateResponse: true,
    })

    await delay(1000)

    if (this.oldPasswordField.current !== null)
      this.oldPasswordField.current.value = ""
    if (this.newPasswordField.current !== null)
      this.newPasswordField.current.value = ""
    if (this.confirmNewPasswordField.current !== null)
      this.confirmNewPasswordField.current.value = ""

    this.setState({
      awaitingUpdateResponse: false,
      displayMessage: "Password updated successfully!",
      displayMessageClassNameSuffix: " is-success",
    })
  }
}
