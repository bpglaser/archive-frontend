import React from 'react';
import { Invite } from '../Models/Invite';

interface Props {
  cancelInvite: (invite: Invite) => Promise<void>;
  invites: Invite[];
}

interface State {
}

export default class PendingInvitationsDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<div className="invites">
      {
        this.props.invites.map((invite, i) =>
          <div className="invite" key={i}>
            {invite.invitee!.email} <button className="delete is-small" onClick={async () => await this.props.cancelInvite(invite)} />
          </div>
        )
      }
    </div>);
  }
}

