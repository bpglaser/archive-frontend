import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import JoinProject from '../Components/JoinProject';
import { Backend } from '../Data/Backend';
import { InviteDetails } from '../Models/InviteDetails';

interface Props extends RouteComponentProps {
  backend: Backend;
  token: string | null;
}

interface State {
  awaitingResponse: boolean;
  details: InviteDetails | null;
}

export default class Invite extends React.Component<Props, State> {
  inviteKey: string | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      awaitingResponse: false,
      details: null
    };

    const params = new URLSearchParams(this.props.location.search);
    this.inviteKey = params.get('key');
  }

  async componentDidMount() {
    await this.loadDetails();
  }

  render() {
    // TODO prompt login if logged out
    if (!this.inviteKey || !this.props.token) {
      return <Redirect to="/" />;
    }

    return (<div className="columns is-centered" style={{ marginTop: "1em" }}>
      <div className="column is-half">
        <JoinProject
          acceptClicked={this.acceptClicked}
          buttonsDisabled={this.state.awaitingResponse}
          declineClicked={this.declineClicked}
          details={this.state.details} />
      </div>
    </div>);
  }

  loadDetails = async () => {
    if (this.props.token === null || this.inviteKey === null) {
      // TODO handle
      return;
    }

    try {
      this.setState({ details: null });
      const details = await this.props.backend.invite(this.props.token, this.inviteKey);
      console.log(details);
      this.setState({ details: details });
    } catch (err) {
      // TODO handle error
    }
  }

  acceptClicked = async () => {
    try {
      this.setState({ awaitingResponse: true });
      await this.props.backend.acceptInvite(this.props.token!, this.inviteKey!);
    } finally {
      this.setState({ awaitingResponse: false });
    }
  }

  declineClicked = async () => {
    try {
      this.setState({ awaitingResponse: true });
      await this.props.backend.declineInvite(this.props.token!, this.inviteKey!);
    } finally {
      this.setState({ awaitingResponse: false });
    }
  }
}
