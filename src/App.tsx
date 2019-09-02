import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';
import Primary from './Routes/Primary';
import Navbar from './Components/Navbar';
import { Login, LoginDisplayMode } from './Components/Login';
import Projects from './Routes/Projects';
import ProjectDetails from './Routes/ProjectDetails';
import Settings from './Routes/Settings';
import { User } from './Models/helpers';

type State = {
  loggedInAs: User | null,
  loginDisplayMode: LoginDisplayMode,
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      loggedInAs: null,
      loginDisplayMode: LoginDisplayMode.Hidden,
    }
  }

  render() {
    return (<div className="container">
      <HashRouter>
        <Navbar
          loggedInAs={this.state.loggedInAs}
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
      loggedInAs: { username: "ExampleUser01" },
      loginDisplayMode: LoginDisplayMode.Hidden,
    })
  }

  logInClicked = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Login,
    })
  }

  loginCompleted = () => {
    this.setState({
      loggedInAs: { username: "ExampleUser01" },
      loginDisplayMode: LoginDisplayMode.Hidden,
    })
  }

  logOutClicked = () => {
    this.setState({
      loggedInAs: null,
    })
  }
}

export default App
