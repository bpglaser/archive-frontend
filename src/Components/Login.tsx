import React from "react";

export enum LoginDisplayMode {
  Hidden,
  Login,
  Register,
}

interface Props {
  close: () => void;
  loading: boolean;
  login: () => void;
  mode: LoginDisplayMode;
  register: () => void;
}

export class Login extends React.Component<Props> {
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
              <input className="input" type="email" placeholder="Email" />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </p>
          </div>

          <div className="field">
            <p className="control has-icons-left">
              <input className="input" type="password" placeholder="Password" />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>

          {this.props.mode === LoginDisplayMode.Register &&
            <div className="field">
              <p className="control has-icons-left">
                <input className="input" type="password" placeholder="Confirm password" />
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
                  disabled={this.props.loading}
                  onClick={this.props.login}>
                    Login
                </button>
              }

              {this.props.mode === LoginDisplayMode.Register &&
                <button
                  className={this.getButtonClassName("button is-success")}
                  disabled={this.props.loading}
                  onClick={this.props.register}>
                    Register
                </button>
              }
            </p>
          </div>
        </footer>
      </div>
    </div>)
  }

  getButtonClassName = (s: string): string => {
    if (this.props.loading) {
      return s + ' is-loading'
    }
    return s
  }
}
