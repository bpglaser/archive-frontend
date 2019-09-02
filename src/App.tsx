import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';
import Primary from './Routes/Primary';
import Navbar from './Components/Navbar';
import { Login, LoginDisplayMode } from './Components/Login';
import Projects from './Routes/Projects';
import ProjectDetails from './Routes/ProjectDetails';
import Settings from './Routes/Settings';

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
        <Route path="/projects" exact component={Projects} />
        <Route path="/projects/:id" component={ProjectDetails} />
        <Route path="/settings" exact component={Settings} />

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
