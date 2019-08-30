import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';
import Primary from './Primary';
import Navbar from './Navbar';
import { Login, LoginDisplayMode } from './Login';

type State = {
  loggedIn: boolean,
  loginDisplayMode: LoginDisplayMode,
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      loggedIn: false,
      loginDisplayMode: LoginDisplayMode.Hidden,
    }
  }
  render() {
    return (<div className="container">
      <HashRouter>
        <Navbar
          loggedIn={this.state.loggedIn}
          registerClicked={this.registerClicked}
          logInClicked={this.logInClicked}
          logOutClicked={this.logOutClicked} />

        <Route path="/" exact component={Primary} />

        {this.state.loginDisplayMode !== LoginDisplayMode.Hidden &&
          <Login
            close={this.closeLoginPrompt}
            login={this.loginCompleted}
            mode={this.state.loginDisplayMode}
            register={this.registerCompleted} />
        }
      </HashRouter>
    </div>)
  }

  closeLoginPrompt = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Hidden,
    })
  }

  registerClicked = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Register,
    })
  }

  registerCompleted = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Hidden,
      loggedIn: true,
    })
  }

  logInClicked = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Login,
    })
  }

  loginCompleted = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Hidden,
      loggedIn: true,
    })
  }

  logOutClicked = () => {
    this.setState({
      loggedIn: false
    })
  }
}

export default App
