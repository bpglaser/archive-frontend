import React from 'react';
import zxcvbn from 'zxcvbn';
import { Backend } from '../../Data/Backend';
import { vaildEmail, validPassword, registerEscHandler, unregisterEscHandler } from '../../Helpers';
import { User } from '../../Models/User';
import StrengthIndicator from '../StrengthIndicator';
import ValidationField from '../ValidationField';

export enum LoginDisplayMode {
  Login,
  Register,
}

interface Props {
  backend: Backend;
  close: () => void;
  loginSuccess: (user: User, token: string) => void;
  mode: LoginDisplayMode;
}

interface State {
  email: string;
  emailInvalid: boolean,
  errorMessage: string | null;
  loading: boolean;
  password: string;
  passwordConfirmation: string;
  passwordInvalid: boolean,
  passwordsMatch: boolean,
  passwordStrength: zxcvbn.ZXCVBNResult | null,
}

export class LoginPrompt extends React.Component<Props, State> {
  emailRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.emailRef = React.createRef();
    this.state = {
      email: '',
      emailInvalid: false,
      errorMessage: null,
      loading: false,
      password: '',
      passwordConfirmation: '',
      passwordInvalid: false,
      passwordsMatch: true,
      passwordStrength: null,
    };
  }

  componentDidMount() {
    registerEscHandler(this.props.close);

    if (this.emailRef.current) {
      this.emailRef.current.focus();
    }
  }

  componentWillUnmount() {
    unregisterEscHandler();
  }

  render() {
    const title = this.props.mode === LoginDisplayMode.Register ? "Register" : "Login";

    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <ValidationField
            disabled={this.state.loading}
            innerInputRef={this.emailRef}
            invalid={this.state.emailInvalid}
            invalidMessage="Invalid email address"
            leftIconName="fa-envelope"
            inputPlaceholder="Email"
            rightIconName="fa-exclamation-triangle"
            submit={this.submit}
            inputType="email"
            onChange={this.emailOnChange}
            value={this.state.email}
          />

          <ValidationField
            disabled={this.state.loading}
            invalid={this.state.passwordInvalid}
            invalidMessage="Invalid password"
            leftIconName="fa-lock"
            inputPlaceholder="Password"
            rightIconName="fa-exclamation-triangle"
            submit={this.submit}
            inputType="password"
            onChange={this.passwordOnChange}
            value={this.state.password}
          />

          {this.props.mode === LoginDisplayMode.Register &&
            <StrengthIndicator passwordStrength={this.state.passwordStrength} />
          }

          {this.props.mode === LoginDisplayMode.Register &&
            <ValidationField
              disabled={this.state.loading}
              invalid={!this.state.passwordsMatch}
              invalidMessage="Passwords must match"
              leftIconName="fa-lock"
              inputPlaceholder="Confirm password"
              rightIconName="fa-exclamation-triangle"
              submit={this.submit}
              inputType="password"
              onChange={this.passwordConfirmationOnChange}
              value={this.state.passwordConfirmation}
            />
          }
        </section>

        <footer className="modal-card-foot">
          <div className="field">
            <p className="control">
              {this.props.mode === LoginDisplayMode.Login &&
                <button
                  className={this.getButtonClassName("button is-success")}
                  disabled={this.state.loading}
                  onClick={this.login}>
                  Login
                </button>
              }

              {this.props.mode === LoginDisplayMode.Register &&
                <button
                  className={this.getButtonClassName("button is-success")}
                  disabled={this.state.loading}
                  onClick={this.register}>
                  Register
                </button>
              }
            </p>

            {this.state.errorMessage !== null &&
              <p className="help is-danger">{this.state.errorMessage}</p>
            }
          </div>
        </footer>
      </div>
    </div>);
  }

  getButtonClassName = (s: string): string => {
    if (this.state.loading) {
      return s + ' is-loading';
    }
    return s;
  }

  validateFields = (): boolean => {
    let valid = true;

    if (vaildEmail(this.state.email)) {
      this.setState({ emailInvalid: false });
    } else {
      this.setState({ emailInvalid: true });
      valid = false;
    }

    if (validPassword(this.state.password)) {
      this.setState({ passwordInvalid: false });
    } else {
      this.setState({ passwordInvalid: true });
      valid = false;
    }

    if (this.props.mode === LoginDisplayMode.Register) {
      if (this.state.password === this.state.passwordConfirmation) {
        this.setState({ passwordsMatch: true });
      } else {
        this.setState({ passwordsMatch: false });
        valid = false;
      }
    }

    return valid;
  }

  login = async () => {
    const email = this.state.email;
    const password = this.state.password;

    if (this.validateFields()) {
      this.setState({
        loading: true,
      });

      try {
        const { user, token } = await this.props.backend.login(email, password);

        this.setState({
          loading: false,
        });

        this.props.loginSuccess(user, token);
      } catch (err) {
        console.log('Error encountered while logging in!');
        console.log(err);

        this.setState({
          errorMessage: String(err),
          loading: false,
        });
      }
    }
  }

  register = async () => {
    const email = this.state.email;
    const password = this.state.password;

    if (this.validateFields()) {
      this.setState({
        loading: true,
      });

      try {
        const { user, token } = await this.props.backend.register(email, password);

        this.setState({
          loading: false,
        });

        this.props.loginSuccess(user, token);
      } catch (err) {
        console.log('Error encountered while registering!');
        console.log(err);

        this.setState({
          errorMessage: String(err),
          loading: false,
        });
      }
    }
  }

  submit = async () => {
    switch (this.props.mode) {
      case LoginDisplayMode.Login:
        await this.login();
        break;
      case LoginDisplayMode.Register:
        await this.register();
        break;
    }
  }

  emailOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: event.target.value,
    });
  }

  passwordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.trim() === '') {
      this.setState({
        password: value,
        passwordStrength: null
      });
    } else {
      const result = zxcvbn(value);
      this.setState({
        password: value,
        passwordStrength: result
      });
    }
  }

  passwordConfirmationOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      passwordConfirmation: event.target.value,
    });
  }
}
