import * as React from 'react';
import { Organization } from '../Models/Organization';

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
        </div>
        <footer className="card-footer">
          <p className="card-footer-item">
            <span>
              View on <a href="https://twitter.com/codinghorror/status/506010907021828096">Twitter</a>
            </span>
          </p>
          <p className="card-footer-item">
            <span>
              Share on <a href="#">Facebook</a>
            </span>
          </p>
        </footer>
      </div>
    </div>);
  }
}
