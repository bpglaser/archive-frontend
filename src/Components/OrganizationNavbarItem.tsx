import React from 'react';
import { Link } from 'react-router-dom';
import { Organization } from '../Models/Organization';

interface Props {
  recentOrganizations: Organization[];
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
    if (this.props.recentOrganizations.length === 0) {
      return (<Link to="/organizations" className="navbar-item">Join an Organization!</Link>);
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

        {this.props.recentOrganizations.length > 0 &&
          <hr className="navbar-divider" />
        }

        <Link to="/organizations" className="navbar-item">
          More Organizations
        </Link>
      </div>
    </div>);
  }
}
