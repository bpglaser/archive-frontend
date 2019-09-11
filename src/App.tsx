import { createHashHistory } from 'history';
import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';
import { Login, LoginDisplayMode } from './Components/Login';
import Navbar from './Components/Navbar';
import { User } from './Models/helpers';
import Organizations from './Routes/Organizations';
import Primary from './Routes/Primary';
import ProjectDetails from './Routes/ProjectDetails';
import Projects from './Routes/Projects';
import Settings from './Routes/Settings';

const history = createHashHistory()

interface State {
  loggedInAs: User | null;
  loginDisplayMode: LoginDisplayMode | null;
}

export default class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      loggedInAs: null,
      loginDisplayMode: null,
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
        <Route path="/organizations" exact component={Organizations} />

        {this.state.loginDisplayMode !== null &&
          <Login
            close={this.closeLoginPrompt}
            loginSuccess={this.loginCompleted}
            mode={this.state.loginDisplayMode} />
        }
      </HashRouter>
    </div>)
  }

  closeLoginPrompt = () => {
    this.setState({
      loginDisplayMode: null,
    });
  }

  registerClicked = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Register,
    });
  }

  registerCompleted = async () => {
    this.setState({
      loggedInAs: { username: "ExampleUser01" },
      loginDisplayMode: null,
    });
  }

  logInClicked = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Login,
    })
  }

  loginCompleted = async (user: User, token: string) => {
    this.setState({
      loggedInAs: { username: user.username },
      loginDisplayMode: null,
    });
  }

  logOutClicked = () => {
    this.setState({
      loggedInAs: null,
    });

    // Redirect to root.
    history.push('/');
  }
}
