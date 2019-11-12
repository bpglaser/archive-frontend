import 'bulma';
import { createHashHistory } from 'history';
import Cookies from 'js-cookie';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import ErrorDropdownDisplay from './Components/ErrorDropdownDisplay';
import Navbar from './Components/Navbar';
import { LoginDisplayMode, LoginPrompt } from './Components/Prompts/LoginPrompt';
import { Backend } from './Data/Backend';
import { URLBackend } from "./Data/URLBackend";
import EasterEgg from './EasterEgg';
import { readTokenPayload } from './Helpers';
import { Organization } from './Models/Organization';
import { User } from './Models/User';
import ArticleDetails from './Routes/ArticleDetails';
import CreateArticle from './Routes/CreateArticle';
import EditArticle from './Routes/EditArticle';
import FileDetails from './Routes/FileDetails';
import NotFound from './Routes/NotFound';
import OrganizationDetails from './Routes/OrganizationDetails';
import Primary from './Routes/Primary';
import ProjectDetails from './Routes/ProjectDetails';
import Settings from './Routes/Settings';
import OrganizationManage from './Routes/OrganizationManage';
import CreateOrganizationPrompt from './Components/Prompts/CreateOrganizationPrompt';

const history = createHashHistory();

interface State {
  backend: Backend;
  createOrganizationPromptVisible: boolean;
  easterEgg?: NodeJS.Timeout;
  errorMessages: string[];
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
      // backend: new URLBackend('http://localhost:3001/', this.clientLogout),
      backend: new URLBackend('https://robinsonobservatory.org/', this.clientLogout),
      createOrganizationPromptVisible: false,
      errorMessages: [],
      loggedInAs: user,
      loginDisplayMode: null,
      recentOrganizations: [],
      token: token,
    };
  }

  async componentDidMount() {
    await this.populateRecentOrganizations();
    const easterEgg = new EasterEgg(this.doEasterEgg);
    document.addEventListener('keyup', easterEgg.handleKeyEvent)
  }

  render() {
    return (<div className={this.state.easterEgg ? "container easter-egg" : "container"}>
      <BrowserRouter>
        <Navbar
          backend={this.state.backend}
          displayError={this.displayError}
          loggedInAs={this.state.loggedInAs}
          registerClicked={this.registerClicked}
          logInClicked={this.showLoginPrompt}
          logOutClicked={this.logOutClicked}
          showCreateOrganizationPrompt={this.showCreateOrganizationPrompt}
          recentOrganizations={this.state.recentOrganizations}
          token={this.state.token}
        />

        <Switch>
          <Route path="/" exact>
            <Primary
              backend={this.state.backend}
              displayError={this.displayError}
              token={this.state.token}
            />
          </Route>

          <Route path="/projects/:id"
            render={(props) =>
              <ProjectDetails
                {...props}
                backend={this.state.backend}
                token={this.state.token}
              />
            }
          />

          <Route path="/settings" exact
            render={(props) =>
              this.requireAuthentication(
                <Settings
                  {...props}
                  backend={this.state.backend}
                  displayError={this.displayError}
                  token={this.state.token!}
                  user={this.state.loggedInAs!}
                  updateLogin={this.loginCompleted}
                />
              )
            }
          />

          <Route path="/organizations/:id/manage"
            render={(props) =>
              this.requireAuthentication(
                <OrganizationManage
                  {...props}
                  backend={this.state.backend}
                  displayError={this.displayError}
                  token={this.state.token!}
                />
              )
            }
          />

          <Route path="/organizations/:id"
            render={(props) =>
              this.requireAuthentication(
                <OrganizationDetails
                  {...props}
                  backend={this.state.backend}
                  organizationDeleted={this.organizationDeleted}
                  token={this.state.token!}
                />
              )
            }
          />

          <Route path="/article/new" exact
            render={(props) =>
              this.requireAuthentication(
                <CreateArticle
                  backend={this.state.backend}
                  token={this.state.token!}
                />
              )
            }
          />

          <Route path="/article/edit/:id"
            render={(props) =>
              this.requireAuthentication(
                <EditArticle
                  {...props}
                  backend={this.state.backend}
                  token={this.state.token!}
                />
              )
            }
          />

          <Route path="/article/:id"
            render={(props) =>
              <ArticleDetails
                {...props}
                backend={this.state.backend}
                token={this.state.token}
              />
            }
          />

          <Route path="/file/:id"
            render={(props) =>
              <FileDetails
                {...props}
                backend={this.state.backend}
                displayError={this.displayError}
                token={this.state.token}
              />
            }
          />

          <Route>
            <NotFound />
          </Route>
        </Switch>

        {this.state.loginDisplayMode !== null &&
          <LoginPrompt
            close={this.hidePrompt}
            backend={this.state.backend}
            loginSuccess={this.loginCompleted}
            mode={this.state.loginDisplayMode}
          />
        }

        {this.state.token && this.state.createOrganizationPromptVisible &&
          <CreateOrganizationPrompt
            backend={this.state.backend}
            close={this.hidePrompt}
            success={this.organizationCreated}
            token={this.state.token}
          />
        }

        {this.state.errorMessages.length > 0 &&
          <ErrorDropdownDisplay
            close={this.advanceError}
            errorMessage={this.state.errorMessages[0]}
          />
        }
      </BrowserRouter>
    </div>);
  }

  advanceError = () => {
    if (this.state.errorMessages.length > 0) {
      this.setState({
        errorMessages: this.state.errorMessages.slice(1),
      });
    }
  }

  displayError = (errorMessage: string) => {
    this.setState({
      errorMessages: [...this.state.errorMessages, errorMessage],
    });
  }

  hidePrompt = () => {
    this.setState({
      createOrganizationPromptVisible: false,
      loginDisplayMode: null,
    });
  }

  registerClicked = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Register,
    });
  }

  showLoginPrompt = () => {
    this.setState({
      loginDisplayMode: LoginDisplayMode.Login,
    });
  }

  showCreateOrganizationPrompt = () => {
    this.setState({
      loginDisplayMode: null,
      createOrganizationPromptVisible: true,
    });
  }

  organizationCreated = (organization: Organization) => {
    this.setState((oldState) => ({
      createOrganizationPromptVisible: false,
      loginDisplayMode: null,
      recentOrganizations: [...oldState.recentOrganizations, organization].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }

  organizationDeleted = (organization: Organization) => {
    this.setState((oldState) => ({
      recentOrganizations: oldState.recentOrganizations.filter((oldOrganization) => oldOrganization.organizationID !== organization.organizationID),
    }));
  }

  loginCompleted = async (user: User, token: string) => {
    Cookies.set('login-token', token);
    this.setState({
      loggedInAs: user,
      token: token,
      loginDisplayMode: null,
    });

    await this.populateRecentOrganizations();
  }

  clientLogout = () => {
    console.log('Doing client logout');
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

  logOutClicked = async () => {
    if (this.state.token === null) {
      return;
    }

    try {
      await this.state.backend.logout(this.state.token);
    } catch (err) {
      console.log('Error while logging out. Just clearing the cookies.');
      console.log(err);
    }

    // Do the client logout even if there was an error
    this.clientLogout();
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

  requireAuthentication = (component: any) => {
    if (this.state.token) {
      return component;
    } else {
      return <Redirect to="/" />;
    }
  }

  doEasterEgg = () => {
    if (this.state.easterEgg) {
      return;
    }

    const timeout = setInterval(
      () => {
        this.setState((oldState) => {
          if (oldState.easterEgg) {
            clearInterval(oldState.easterEgg);
          }
          return {
            easterEgg: undefined,
          };
        });
      },
      1000
    );

    this.setState({
      easterEgg: timeout,
    });
  }
}
