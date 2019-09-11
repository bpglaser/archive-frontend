import React from 'react';
import * as Backend from '../Data/Backend';
import { User } from '../Data/Backend';
import { vaildEmail, validPassword } from '../Helpers';

export enum LoginDisplayMode {
  Login,
  Register,
}

interface Props {
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
          <div className="field">
            <p className={this.state.emailInvalid ? "control has-icons-left has-icons-right" : "control has-icons-left"}>
              <input
                className={this.state.emailInvalid ? "input is-danger" : "input"}
                type="email"
                placeholder="Email"
                disabled={this.state.loading}
                ref={this.emailRef} />

              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>

              {this.state.emailInvalid &&
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
              }
            </p>

            {this.state.emailInvalid &&
              <p className="help is-danger">Invalid email address</p>
            }
          </div>

          <div className="field">
            <p className={this.state.passwordInvalid ? "control has-icons-left has-icons-right" : "control has-icons-left"}>
              <input
                className={this.state.passwordInvalid ? "input is-danger" : "input"}
                type="password"
                placeholder="Password"
                disabled={this.state.loading}
                ref={this.passwordRef} />

              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>

              {this.state.passwordInvalid &&
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
              }
            </p>

            {this.state.passwordInvalid &&
              <p className="help is-danger">Invalid password</p>
            }
          </div>

          {this.props.mode === LoginDisplayMode.Register &&
            <div className="field">
              <p className={this.state.passwordsMatch ? "control has-icons-left" : "control has-icons-left has-icons-right"}>
                <input
                  className={this.state.passwordsMatch ? "input" : "input is-danger"}
                  type="password"
                  placeholder="Confirm password"
                  disabled={this.state.loading}
                  ref={this.passwordConfirmationRef} />

                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>

                {!this.state.passwordsMatch &&
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                }
              </p>

              {!this.state.passwordsMatch &&
                <p className="help is-danger">Passwords must match</p>
              }
            </div>
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
          const { user, token } = await Backend.login(email, password);

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
          const { user, token } = await Backend.register(email, password);

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
