import { createHashHistory } from 'history';
import Cookies from 'js-cookie';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import { Login, LoginDisplayMode } from './Components/Login';
import Navbar from './Components/Navbar';
import { Backend } from './Data/Backend';
import { URLBackend } from "./Data/URLBackend";
import { readTokenPayload } from './Helpers';
import { User } from './Models/User';
import Invite from './Routes/Invite';
import Organizations from './Routes/Organizations';
import Primary from './Routes/Primary';
import ProjectDetails from './Routes/ProjectDetails';
import Projects from './Routes/Projects';
import Settings from './Routes/Settings';

const history = createHashHistory()

interface State {
  backend: Backend;
  loggedInAs: User | null;
  loginDisplayMode: LoginDisplayMode | null;
  token: string | null;
}

export default class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    const cookieToken = Cookies.get('login-token');

    let token = null;
    let user = null;
    if (cookieToken !== undefined) {
      token = cookieToken;
      user = readTokenPayload(token);
    }

    this.state = {
      backend: new URLBackend('https://robinsonobservatory.org/'),
      loggedInAs: user,
      loginDisplayMode: null,
      token: token,
    }
  }

  render() {
    return (<div className="container">
      <BrowserRouter>
        <Navbar
          loggedInAs={this.state.loggedInAs}
          registerClicked={this.registerClicked}
          logInClicked={this.logInClicked}
          logOutClicked={this.logOutClicked} />

        <Route path="/" exact component={Primary} />
        <Route path="/projects" exact component={Projects} />
        <Route path="/projects/:id" component={ProjectDetails} />
        <Route path="/settings" exact render={(props) => <Settings {...props} backend={this.state.backend} token={this.state.token} />} />
        <Route path="/organizations" exact component={Organizations} />
        <Route path="/invite" exact render={(props) => <Invite {...props} backend={this.state.backend} token={this.state.token} />} />

        {this.state.loginDisplayMode !== null &&
          <Login
            close={this.closeLoginPrompt}
            backend={this.state.backend}
            loginSuccess={this.loginCompleted}
            mode={this.state.loginDisplayMode} />
        }
      </BrowserRouter>
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

  logInClicked = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Login,
    })
  }

  loginCompleted = async (user: User, token: string) => {
    Cookies.set('login-token', token);
    this.setState({
      loggedInAs: user,
      token: token,
      loginDisplayMode: null,
    });
  }

  logOutClicked = async () => {
    if (this.state.token !== null) {
      try {
        await this.state.backend.logout(this.state.token);
      } catch (err) {
        console.log('Error while logging out. Just clearing the cookies.');
        console.log(err);
      }

      Cookies.remove('login-token');
      this.setState({
        loggedInAs: null,
        token: null,
      });

      // Redirect to root.
      history.push('/');
    }
  }
}
