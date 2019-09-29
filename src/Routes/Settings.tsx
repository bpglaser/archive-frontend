import * as React from "react";
import { Redirect } from "react-router";
import AccountSettings from "../Components/Settings/AccountSettings";
import { Backend } from "../Data/Backend";

interface Props {
  backend: Backend;
  token: string | null;
}

export default class Settings extends React.Component<Props> {
  render() {
    if (this.props.token === null) {
      return <Redirect to="/" />;
    }

    const params = new URLSearchParams((this.props as any).location.search);
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
