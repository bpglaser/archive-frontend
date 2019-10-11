import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import JoinProject from '../Components/JoinProject';
import { Backend } from '../Data/Backend';
import { InviteDetails } from '../Models/InviteDetails';

interface Props extends RouteComponentProps {
  backend: Backend;
  token: string;
}

interface State {
  awaitingResponse: boolean;
  details: InviteDetails | null;
  redirect: string | null;
}

export default class Invite extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      awaitingResponse: false,
      details: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    const inviteKey = this.getInviteKey();
    if (inviteKey) {
      await this.loadDetails(this.props.token, inviteKey);
    }
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.location.search !== oldProps.location.search) {
      const inviteKey = this.getInviteKey();
      if (inviteKey) {
        await this.loadDetails(this.props.token, inviteKey);
      } else {
        this.setState({
          redirect: '/'
        });
      }
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (<div className="columns is-centered" style={{ marginTop: "1em" }}>
      <div className="column is-half">
        <JoinProject
          acceptClicked={this.acceptClicked}
          buttonsDisabled={this.state.awaitingResponse}
          declineClicked={this.declineClicked}
          details={this.state.details}
        />
      </div>
    </div>);
  }

  loadDetails = async (token: string, inviteKey: string) => {
    try {
      this.setState({ details: null });
      const details = await this.props.backend.invite(token, inviteKey);
      console.log(details);
      this.setState({ details: details });
    } catch (err) {
      // TODO handle error
    }
  }

  acceptClicked = async () => {
    const token = this.props.token;
    const inviteKey = this.getInviteKey();

    if (!inviteKey) {
      return;
    }

    try {
      this.setState({ awaitingResponse: true });
      await this.props.backend.acceptInvite(token, inviteKey);
    } finally {
      this.setState({ awaitingResponse: false });
    }
  }

  declineClicked = async () => {
    const token = this.props.token;
    const inviteKey = this.getInviteKey();

    if (!inviteKey) {
      return;
    }

    try {
      this.setState({ awaitingResponse: true });
      await this.props.backend.declineInvite(token, inviteKey);
    } finally {
      this.setState({ awaitingResponse: false });
    }
  }

  getInviteKey = () => {
    const params = new URLSearchParams(this.props.location.search);
    return params.get('key');
  }
}
