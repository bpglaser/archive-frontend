import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router";
import AccountSettings from "../Components/Settings/AccountSettings";
import { Backend } from "../Data/Backend";

interface Props extends RouteComponentProps {
  backend: Backend;
  token: string;
}

export default class Settings extends React.Component<Props> {
  render() {
    const params = new URLSearchParams(this.props.location.search);
    let details;
    switch (params.get("page")) {
      case "account":
        details = <AccountSettings backend={this.props.backend} token={this.props.token} />
        break;
      default:
        return <Redirect to="/settings?page=account" />
    }

    return (<div>
      <h1 className="title">Settings</h1>

      <div className="columns">
        <aside className="column is-one-quarter menu">
          <p className="menu-label">Account</p>
        </aside>

        <div className="column">
          {details}
        </div>
      </div>
    </div>)
  }
}
