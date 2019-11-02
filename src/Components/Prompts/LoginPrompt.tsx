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
  emailValid: boolean;
  errorMessage: string | null;
  loading: boolean;
  password: string;
  passwordConfirmation: string;
  passwordValid: boolean;
  passwordsMatch: boolean;
  passwordStrength: zxcvbn.ZXCVBNResult | null;
  username: string;
  usernameInvalidMessage: string;
  usernameValid: boolean;
}

export class LoginPrompt extends React.Component<Props, State> {
  readonly emailRef: React.RefObject<HTMLInputElement>;
  readonly usernameRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      emailValid: true,
      errorMessage: null,
      loading: false,
      password: '',
      passwordConfirmation: '',
      passwordValid: true,
      passwordsMatch: true,
      passwordStrength: null,
      username: '',
      usernameInvalidMessage: '',
      usernameValid: true,
    };
    this.emailRef = React.createRef();
    this.usernameRef = React.createRef();
  }

  componentDidMount() {
    registerEscHandler(this.props.close);

    if (this.props.mode === LoginDisplayMode.Login) {
      if (this.emailRef.current) {
        this.emailRef.current.focus();
      }
    } else {
      if (this.usernameRef.current) {
        this.usernameRef.current.focus();
      }
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
          {this.props.mode === LoginDisplayMode.Register &&
            <ValidationField
              disabled={this.state.loading}
              innerInputRef={this.usernameRef}
              label="Username"
              inputType="text"
              invalid={!this.state.usernameValid}
              invalidMessage={this.state.usernameInvalidMessage}
              leftIconName="fa-user"
              submit={this.submit}
              rightIconName="fa-exclamation-triangle"
              onChange={this.usernameOnChange}
              value={this.state.username}
            />
          }

          <ValidationField
            disabled={this.state.loading}
            innerInputRef={this.emailRef}
            invalid={!this.state.emailValid}
            invalidMessage="Invalid email address"
            leftIconName="fa-envelope"
            label="Email"
            rightIconName="fa-exclamation-triangle"
            submit={this.submit}
            inputType="email"
            onChange={this.emailOnChange}
            value={this.state.email}
          />

          <ValidationField
            disabled={this.state.loading}
            invalid={!this.state.passwordValid}
            invalidMessage="Invalid password"
            leftIconName="fa-lock"
            label="Password"
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
              label="Confirm password"
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
    return this.state.emailValid
      && this.state.passwordValid
      && this.state.passwordsMatch;
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
    const email = event.target.value;
    this.setState({
      email: email,
      emailValid: vaildEmail(email),
    });
  }

  passwordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    const strength = password.trim() === '' ? null : zxcvbn(password);
    this.setState((oldState) => ({
      password: password,
      passwordValid: validPassword(password),
      passwordsMatch: this.props.mode === LoginDisplayMode.Login || password === oldState.passwordConfirmation,
      passwordStrength: strength,
    }));
  }

  passwordConfirmationOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const passwordConfirmation = event.target.value;
    this.setState((oldState) => ({
      passwordConfirmation: passwordConfirmation,
      passwordsMatch: oldState.password === passwordConfirmation,
    }));
  }

  usernameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;
    // TODO validate username
    this.setState({
      username: username,
    });
  }
}
