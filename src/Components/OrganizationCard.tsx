import * as React from 'react';
import { Organization } from '../Models/Organization';
import { Link } from 'react-router-dom';

interface Props {
  organization: Organization;
}

export default class OrganizationCard extends React.Component<Props> {
  render() {
    return (<div className="organization-card">
      <div className="card">
        <div className="card-content">
          <p className="title">
            {this.props.organization.name}
          </p>
          <p className="subtitle">
            {this.props.organization.description}
          </p>
          {this.props.organization.projectCount &&
            <p>
              Projects: {this.props.organization.projectCount}
            </p>
          }
          {this.props.organization.fileCount &&
            <p>
              Files: {this.props.organization.fileCount}
            </p>
          }
        </div>
        <footer className="card-footer">
          <p className="card-footer-item">
            <span>
              <Link to={"/organizations/" + this.props.organization.organizationID}>View</Link>
            </span>
          </p>
        </footer>
      </div>
    </div>);
  }
}
