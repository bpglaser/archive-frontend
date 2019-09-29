import React from 'react';
import { Link } from 'react-router-dom';
import { Organization } from '../Models/Organization';

interface Props {
  activeOrganization: Organization | null;
  recentOrganizations: Organization[];
  switchOrganization: (organization: Organization) => void;
}

interface State {

}

export default class OrganizationNavbarItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }
  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    if (this.props.recentOrganizations.length === 0) {
      return (<Link to="/organizations" className="navbar-item">Join an Organization!</Link>);
    }

    return (<div className="navbar-item has-dropdown is-hoverable">
      {this.props.activeOrganization &&
        <Link to={'/organizations/' + this.props.activeOrganization.organizationID} className="navbar-link">
          {this.props.activeOrganization ? this.props.activeOrganization.name : 'Organizations'}
        </Link>
      }

      {!this.props.activeOrganization &&
        <div className="navbar-item">
          Select Organization
        </div>
      }

      <div className="navbar-dropdown">
        {
          this.props.recentOrganizations
            .filter((org) => org !== this.props.activeOrganization)
            .map((organization, i) =>
              <a className="navbar-item" onClick={() => this.props.switchOrganization(organization)} key={i}>
                Switch to {organization.name}
              </a>
            )
        }

        {this.props.recentOrganizations.length > 0 &&
          <hr className="navbar-divider" />
        }

        <Link to="/organizations" className="navbar-item">
          More Organizations
        </Link>
      </div>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}
