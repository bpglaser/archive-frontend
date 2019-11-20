import React from 'react';
import { Link } from 'react-router-dom';
import { Organization } from '../Models/Organization';
import { isAdmin } from '../Helpers';

interface Props {
  showJoinOrganizationPrompt: () => void;
  recentOrganizations: Organization[];
  showCreateOrganizationPrompt: () => void;
  token: string | null;
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
      if (isAdmin(this.props.token)) {
        return (<a className="navbar-item" onClick={this.props.showCreateOrganizationPrompt}>
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
          <span>
            Create new organization
          </span>
        </a>);
      } else {
        return (<a className="navbar-item" onClick={this.props.showJoinOrganizationPrompt}>Join an Organization!</a>);
      }
    }

    return (<div className="navbar-item has-dropdown is-hoverable">
      <div className="navbar-item">
        My Organizations
      </div>

      <div className="navbar-dropdown">
        {
          this.props.recentOrganizations
            .map((organization, i) =>
              <Link to={"/organizations/" + organization.organizationID} className="navbar-item" key={i}>
                {organization.name}
              </Link>
            )
        }

        {isAdmin(this.props.token) && this.props.recentOrganizations.length > 0 &&
          <hr className="navbar-divider" />
        }

        {isAdmin(this.props.token) &&
          <a className="navbar-item" onClick={this.props.showCreateOrganizationPrompt}>
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>
              Create new organization
            </span>
          </a>
        }
      </div>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}
