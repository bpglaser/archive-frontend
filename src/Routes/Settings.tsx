import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router";
import AccountSettings from "../Components/Settings/AccountSettings";
import { Backend } from "../Data/Backend";
import Breadcrumb from "../Components/Breadcrumb";
import { User } from "../Models/User";

interface Props extends RouteComponentProps {
  backend: Backend;
  displayError: (errorMessage: string) => void;
  token: string;
  user: User;
  updateLogin: (user: User, token: string) => void;
}

export default class Settings extends React.Component<Props> {
  render() {
    const params = new URLSearchParams(this.props.location.search);
    let details;
    switch (params.get("page")) {
      case "account":
        details =
          <AccountSettings
            backend={this.props.backend}
            displayError={this.props.displayError}
            token={this.props.token}
            user={this.props.user}
            updateLogin={this.props.updateLogin}
          />
        break;
      default:
        return <Redirect to="/settings?page=account" />
    }

    return (<div>
      <Breadcrumb
        links={[
          ["Settings", "/settings"],
        ]}
      />

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
