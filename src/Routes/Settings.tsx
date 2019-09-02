import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import AccountSettings from "../Components/Settings/AccountSettings";

export default class Settings extends React.Component<RouteComponentProps> {
  render() {
    let params = new URLSearchParams(this.props.location.search)
    let details
    switch (params.get("page")) {
      case "account":
        details = <AccountSettings />
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