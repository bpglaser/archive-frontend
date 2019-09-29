import { createHashHistory } from 'history';
import Cookies from 'js-cookie';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import { LoginDisplayMode, LoginPrompt } from './Components/Prompts/LoginPrompt';
import { Backend } from './Data/Backend';
import { URLBackend } from "./Data/URLBackend";
import { readTokenPayload } from './Helpers';
import { Organization } from './Models/Organization';
import { User } from './Models/User';
import Invite from './Routes/Invite';
import Organizations from './Routes/Organizations';
import Primary from './Routes/Primary';
import ProjectDetails from './Routes/ProjectDetails';
import Projects from './Routes/Projects';
import Settings from './Routes/Settings';

const history = createHashHistory()

interface State {
  activeOrganization: Organization | null;
  backend: Backend;
  loggedInAs: User | null;
  loginDisplayMode: LoginDisplayMode | null;
  recentOrganizations: Organization[];
  token: string | null;
}

export default class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    const cookieToken = Cookies.get('login-token');

    let token = null;
    let user = null;
    if (cookieToken !== undefined) {
      token = cookieToken;
      user = readTokenPayload(token);
    }

    this.state = {
      activeOrganization: null,
      backend: new URLBackend('https://robinsonobservatory.org/'),
      loggedInAs: user,
      loginDisplayMode: null,
      recentOrganizations: [],
      token: token,
    };
  }

  async componentDidMount() {
    await this.populateRecentOrganizations();
    await this.populateActiveOrganization();
  }

  render() {
    return (<div className="container">
      <BrowserRouter>
        <Navbar
          loggedInAs={this.state.loggedInAs}
          registerClicked={this.registerClicked}
          logInClicked={this.logInClicked}
          logOutClicked={this.logOutClicked}
          activeOrganization={this.state.activeOrganization}
          recentOrganizations={this.state.recentOrganizations}
          switchOrganization={this.setActiveOrganization}
        />

        <Route path="/" exact component={Primary} />
        <Route path="/projects" exact render={(props) => <Projects {...props} backend={this.state.backend} organization={this.state.activeOrganization} token={this.state.token} />} />
        <Route path="/projects/:id" render={(props) => <ProjectDetails {...props} backend={this.state.backend} organization={this.state.activeOrganization} token={this.state.token} />} />
        <Route path="/settings" exact render={(props) => <Settings {...props} backend={this.state.backend} token={this.state.token} />} />
        <Route path="/organizations" exact render={(props) => <Organizations {...props} backend={this.state.backend} setActiveOrganization={() => { }} token={this.state.token} />} />
        <Route path="/invite" exact render={(props) => <Invite {...props} backend={this.state.backend} token={this.state.token} />} />

        {this.state.loginDisplayMode !== null &&
          <LoginPrompt
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
    });
  }

  loginCompleted = async (user: User, token: string) => {
    Cookies.set('login-token', token);
    this.setState({
      loggedInAs: user,
      token: token,
      loginDisplayMode: null,
    });

    await this.populateRecentOrganizations();
    await this.populateActiveOrganization();
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
      if (history.location.pathname !== '/') {
        history.push('/');
      }
    }
  }

  setActiveOrganization = (organization: Organization) => {
    this.setState({
      activeOrganization: organization,
    });
    Cookies.set('active-organization-id', organization.organizationID.toString());
  }

  populateActiveOrganization = async () => {
    if (this.state.token === null) {
      return;
    }

    try {
      const activeOrganizationID = Cookies.get('active-organization-id');
      if (!activeOrganizationID) {
        return;
      }

      const activeOrganization = this.state.recentOrganizations.find(org => org.organizationID === Number(activeOrganizationID));
      if (activeOrganization) {
        this.setState({
          activeOrganization: activeOrganization,
        });
      }
    } catch (err) {
      // TODO
    }
  }

  populateRecentOrganizations = async () => {
    if (this.state.token === null) {
      return;
    }

    try {
      const organizations = await this.state.backend.listOrganizations(this.state.token);
      this.setState({
        recentOrganizations: organizations,
      });
    } catch (err) {
      // TODO handle
    }
  }
}
