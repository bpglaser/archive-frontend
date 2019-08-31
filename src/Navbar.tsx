import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  loggedIn: boolean,
  registerClicked: () => void,
  logInClicked: () => void,
  logOutClicked: () => void,
}

type State = {
  burgerState: boolean,
}

class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      burgerState: false,
    }
  }

  render() {
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
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {!this.props.loggedIn &&
              <div className="buttons">
                <button className="button" onClick={this.props.registerClicked}>Register</button>
                <button className="button" onClick={this.props.logInClicked}>Log in</button>
              </div>
            }
            {this.props.loggedIn &&
              <div className="buttons">
                <button className="button" onClick={this.props.logOutClicked}>Log out</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>)
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

export default Navbar
