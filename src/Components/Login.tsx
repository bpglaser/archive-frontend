import React from 'react';
import { Backend, User } from '../Data/Backend';
import { vaildEmail, validPassword } from '../Helpers';
import ValidationField from './ValidationField';

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
  emailInvalid: boolean,
  errorMessage: string | null;
  loading: boolean;
  passwordInvalid: boolean,
  passwordsMatch: boolean,
}

export class Login extends React.Component<Props, State> {
  emailRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  passwordConfirmationRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.passwordConfirmationRef = React.createRef();
    this.state = {
      emailInvalid: false,
      errorMessage: null,
      loading: false,
      passwordInvalid: false,
      passwordsMatch: true,
    };
  }

  render() {
    let title = this.props.mode === LoginDisplayMode.Register ? "Register" : "Login"
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
            inputType="email" />

          <ValidationField
            disabled={this.state.loading}
            innerInputRef={this.passwordRef}
            invalid={this.state.passwordInvalid}
            invalidMessage="Invalid password"
            leftIconName="fa-lock"
            inputPlaceholder="Password"
            rightIconName="fa-exclamation-triangle"
            inputType="password" />

          {this.props.mode === LoginDisplayMode.Register &&
            <ValidationField
              disabled={this.state.loading}
              innerInputRef={this.passwordConfirmationRef}
              invalid={!this.state.passwordsMatch}
              invalidMessage="Passwords must match"
              leftIconName="fa-lock"
              inputPlaceholder="Confirm password"
              rightIconName="fa-exclamation-triangle"
              inputType="password" />
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
    </div>)
  }

  getButtonClassName = (s: string): string => {
    if (this.state.loading) {
      return s + ' is-loading';
    }
    return s;
  }

  validateFields = (): boolean => {
    let valid = true;

    if (this.emailRef.current !== null && this.passwordRef.current !== null) {
      if (vaildEmail(this.emailRef.current.value)) {
        this.setState({ emailInvalid: false });
      } else {
        this.setState({ emailInvalid: true });
        valid = false;
      }

      if (validPassword(this.passwordRef.current.value)) {
        this.setState({ passwordInvalid: false });
      } else {
        this.setState({ passwordInvalid: true });
        valid = false;
      }

      if (this.props.mode === LoginDisplayMode.Register && this.passwordConfirmationRef.current !== null) {
        if (this.passwordRef.current.value === this.passwordConfirmationRef.current.value) {
          this.setState({ passwordsMatch: true });
        } else {
          this.setState({ passwordsMatch: false });
          valid = false;
        }
      }
    }

    return valid;
  }

  login = async () => {
    if (this.emailRef.current !== null && this.passwordRef.current !== null) {
      const email = this.emailRef.current.value;
      const password = this.passwordRef.current.value;

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
  }

  register = async () => {
    if (this.emailRef.current !== null && this.passwordRef.current !== null && this.passwordConfirmationRef.current !== null) {
      const email = this.emailRef.current.value;
      const password = this.passwordRef.current.value;

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
  }
}
