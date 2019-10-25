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
import { readTokenPayload } from './Helpers';
import { Organization } from './Models/Organization';
import { User } from './Models/User';
import ArticleDetails from './Routes/ArticleDetails';
import CreateArticle from './Routes/CreateArticle';
import EditArticle from './Routes/EditArticle';
import FileDetails from './Routes/FileDetails';
import Invite from './Routes/Invite';
import NotFound from './Routes/NotFound';
import OrganizationDetails from './Routes/OrganizationDetails';
import Organizations from './Routes/Organizations';
import Primary from './Routes/Primary';
import ProjectDetails from './Routes/ProjectDetails';
import Settings from './Routes/Settings';

const history = createHashHistory();

interface State {
  backend: Backend;
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
      errorMessages: [],
      loggedInAs: user,
      loginDisplayMode: null,
      recentOrganizations: [],
      token: token,
    };
  }

  async componentDidMount() {
    await this.populateRecentOrganizations();
  }

  render() {
    return (<div className="container">
      <BrowserRouter>
        <Navbar
          loggedInAs={this.state.loggedInAs}
          registerClicked={this.registerClicked}
          logInClicked={this.showLoginPrompt}
          logOutClicked={this.logOutClicked}
          recentOrganizations={this.state.recentOrganizations}
        />

        <Switch>
          <Route path="/" exact>
            <Primary
              backend={this.state.backend}
              token={this.state.token}
            />
          </Route>

          <Route path="/projects/:id"
            render={(props) =>
              this.requireAuthentication(
                <ProjectDetails
                  {...props}
                  backend={this.state.backend}
                  token={this.state.token!}
                />
              )
            }
          />

          <Route path="/settings" exact
            render={(props) =>
              this.requireAuthentication(
                <Settings
                  {...props}
                  backend={this.state.backend}
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
                  token={this.state.token!}
                />
              )
            }
          />

          <Route path="/organizations" exact
            render={(props) =>
              this.requireAuthentication(
                <Organizations
                  backend={this.state.backend}
                  token={this.state.token!}
                />
              )
            }
          />

          <Route path="/invite" exact
            render={(props) =>
              this.requireAuthentication(
                <Invite
                  {...props}
                  backend={this.state.backend}
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
              this.requireAuthentication(
                <FileDetails
                  {...props}
                  backend={this.state.backend}
                  displayError={this.displayError}
                  token={this.state.token!}
                />
              )
            }
          />

          <Route>
            <NotFound />
          </Route>
        </Switch>

        {this.state.loginDisplayMode !== null &&
          <LoginPrompt
            close={this.closeLoginPrompt}
            backend={this.state.backend}
            loginSuccess={this.loginCompleted}
            mode={this.state.loginDisplayMode}
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

  showLoginPrompt = () => {
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
}
