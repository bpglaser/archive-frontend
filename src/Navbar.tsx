import React from 'react'

type Prop = {
  loggedIn: boolean
  registerClicked: () => void
  logInClicked: () => void
  logOutClicked: () => void
}

class Navbar extends React.Component<Prop> {
  render() {
    return (<div className="navbar">
      <div className="navbar-brand">
        <div className="navbar-item">
          <strong>Robinson Observatory Archive</strong>
        </div>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="#">Home</a>
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
}

export default Navbar
