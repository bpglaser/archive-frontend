import React from 'react';
import { Link } from 'react-router-dom';
import { Organization } from '../Models/Organization';
import { User } from '../Models/User';
import OrganizationNavbarItem from './OrganizationNavbarItem';
import InviteBell from './InviteBell';
import { Backend } from '../Data/Backend';

interface Props {
  backend: Backend;
  displayError: (errorMessage: string) => void;
  loggedInAs: User | null;
  registerClicked: () => void;
  logInClicked: () => void;
  logOutClicked: () => void;
  recentOrganizations: Organization[];
  token: string | null;
}

interface State {
  burgerState: boolean;
}

export default class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      burgerState: false,
    };
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (<div className="navbar">
      <div className="navbar-brand">
        <div className="navbar-item">
          <figure className="image">
            <img src="/ucf_logo.png" alt="The UCF logo" />
          </figure>
        </div>

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
        </div>

        <div className="navbar-end">
          {this.props.token !== null &&
            <div className="navbar-item">
              <InviteBell
                backend={this.props.backend}
                displayError={this.props.displayError}
                token={this.props.token}
              />
            </div>
          }

          {this.props.loggedInAs !== null &&
            <OrganizationNavbarItem
              recentOrganizations={this.props.recentOrganizations}
            />
          }

          {this.props.loggedInAs !== null &&
            <Link to="/settings" className="navbar-item">
              {this.props.loggedInAs.username}
            </Link>
          }

          <div className="navbar-item">
            {!this.props.loggedInAs &&
              <div className="buttons">
                <button className="button" onClick={this.props.registerClicked}>Register</button>
                <button className="button" onClick={this.props.logInClicked}>Log in</button>
              </div>
            }

            {this.props.loggedInAs &&
              <div className="buttons">
                <button className="button" onClick={this.props.logOutClicked}>Log out</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }

  burgerClicked = () => {
    this.setState({
      burgerState: !this.state.burgerState,
    });
  }

  modifyClassName = (className: string) => {
    if (this.state.burgerState) {
      return className + " is-active";
    }
    return className;
  }
}
