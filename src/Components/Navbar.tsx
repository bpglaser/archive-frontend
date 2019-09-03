import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../Models/helpers';

type Props = {
  loggedInAs: User | null,
  registerClicked: () => void,
  logInClicked: () => void,
  logOutClicked: () => void,
}

type State = {
  burgerState: boolean,
}

export default class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      burgerState: false,
    }
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (<div className="navbar">
      <div className="navbar-brand">
        <div className="navbar-item">
          <strong>Robinson Observatory Archive</strong>
        </div>

        <a
          role="button"
          className={this.modifyClassName("navbar-burger burger")}
          aria-label="menu"
          aria-expanded="false"
          onClick={this.burgerClicked}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={this.modifyClassName("navbar-menu")}>
        <div className="navbar-start">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/projects" className="navbar-item">My Projects</Link>
          <Link to="/settings" className="navbar-item">Settings</Link>
        </div>

        <div className="navbar-end">
          {this.props.loggedInAs !== null &&
            <Link to="/settings" className="navbar-item">
              {this.props.loggedInAs.username}
            </Link>
          }

          <div className="navbar-item">
            {!this.props.loggedInAs &&
              <div className="buttons">
                <button className="button" onClick={this.props.registerClicked}>Register</button>
                <button className="button" onClick={this.props.logInClicked}>Log in</button>
              </div>
            }

            {this.props.loggedInAs &&
              <div className="buttons">
                <button className="button" onClick={this.props.logOutClicked}>Log out</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>)
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }

  burgerClicked = () => {
    this.setState({
      burgerState: !this.state.burgerState,
    })
  }

  modifyClassName = (className: string) => {
    if (this.state.burgerState) {
      return className + " is-active"
    }
    return className
  }
}
