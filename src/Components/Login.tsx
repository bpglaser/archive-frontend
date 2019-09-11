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
  errorMessage: string | null;
  loading: boolean;
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
      errorMessage: null,
      loading: false,
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
            <p className="control has-icons-left">
              <input
                className="input"
                type="email"
                placeholder="Email"
                disabled={this.state.loading}
                ref={this.emailRef} />

              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </p>
          </div>

          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                placeholder="Password"
                disabled={this.state.loading}
                ref={this.passwordRef} />

              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>

          {this.props.mode === LoginDisplayMode.Register &&
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  placeholder="Confirm password"
                  disabled={this.state.loading}
                  ref={this.passwordConfirmationRef} />

                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
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

  login = async () => {
    if (this.emailRef.current !== null && this.passwordRef.current !== null) {
      const email = this.emailRef.current.value;
      const password = this.passwordRef.current.value;

      if (!vaildEmail(email)) {
        // TODO notify user
      } else if (!validPassword(password)) {
        // TODO notify user
      } else {
        this.setState({
          loading: true,
        });

        try {
          const {user, token } = await Backend.login(email, password);

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
      const passwordConfirmation = this.passwordConfirmationRef.current.value;

      if (!vaildEmail(email)) {
        // TODO notify user
      } else if (!validPassword(password)) {
        // TODO notify user
      } else if (password !== passwordConfirmation) {
        // TODO notify user
      } else {
        this.setState({
          loading: true,
        });

        try {
          const {user, token } = await Backend.register(email, password);

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
