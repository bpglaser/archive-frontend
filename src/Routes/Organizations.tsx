import * as React from "react";
import Loader from "../Components/Loader";
import OrganizationCard from "../Components/OrganizationCard";
import Organization from "../Models/Organization";
import { delay } from "q";

interface State {
  myOrganizations: Organization[] | null;
  publicOrganizations: Organization[] | null;
}

export default class Organizations extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      myOrganizations: null,
      publicOrganizations: null,
    }

    this.loadMyOrganizations().then((myOrganizations) =>
      this.setState({ myOrganizations: myOrganizations }))
    this.loadPublicOrganizations().then((publicOrganizations) =>
      this.setState({ publicOrganizations: publicOrganizations }))
  }

  render() {
    return (<div>
      <div className="level">
        <div className="level-item">
          <h1 className="title">My Organizations</h1>
        </div>
      </div>

      {this.state.myOrganizations === null &&
        <Loader />
      }

      {this.state.myOrganizations !== null &&
        <div className="organization-cards">
          {
            this.state.myOrganizations.map((organization, i) =>
              <OrganizationCard organization={organization} key={i} />)
          }
        </div>
      }

      <div className="level">
        <div className="level-item">
          <h1 className="title">Public Organizations</h1>
        </div>
      </div>

      {this.state.myOrganizations === null &&
        <Loader />
      }

      {this.state.myOrganizations !== null &&
        <div></div>
      }
    </div>)
  }

  loadMyOrganizations = async (): Promise<Organization[]> => {
    await delay(1000)
    return [{}, {}, {}, {}]
  }

  loadPublicOrganizations = async (): Promise<Organization[]> => {
    await delay(1000)
    return []
  }
}