import * as React from "react";
import Organization from "../Models/Organization";

interface Props {
  organization: Organization;
}

export default class OrganizationCard extends React.Component<Props> {
  render() {
    return (<div className="organization-card">
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img src="https://picsum.photos/400/300" />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            Hello
          </div>
        </div>
      </div>
    </div>)
  }
}
