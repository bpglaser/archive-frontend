import React from 'react';

interface Props {
  close: () => void;
}

interface State {
}

export default class JoinOrganizationInfoPrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">About Joining Organizations</p>
          <button className="delete" aria-label="close" onClick={this.props.close} />
        </header>

        <section className="modal-card-body">
          <div className="content">
            <h5>Creating a new organization</h5>

            <p>Organizations can only be created by site administrators. This ensures that only vetted astronomy related organizations are able to be created.</p>

            <h5>Joining an existing organization</h5>

            <p>Organizations are invite only. You must contact an organization owner externally (i.e. via email) in order to join their organization. They will need the email address that you used to register in order to invite you to the organization. Your invite will appear as a notification once the organization owner completes the invite.</p>
          </div>
        </section>

        <footer className="modal-card-foot">
          <button className="button is-primary" onClick={this.props.close}>Okay</button>
        </footer>
      </div>
    </div>);
  }
}
