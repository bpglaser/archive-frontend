import React from 'react';
import { Backend } from '../../Data/Backend';
import { Organization } from '../../Models/Organization';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';
import { Redirect } from 'react-router';

interface Props {
  backend: Backend;
  close: () => void;
  organization: Organization;
  showDeletePrompt: () => void;
  success: (organization: Organization) => void;
  token: string;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
  redirect?: string;
}

export default class OrganizationSettingsPrompt extends React.Component<Props, State> {
  readonly nameRef: React.RefObject<HTMLInputElement>;
  readonly descriptionRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
      errorMessage: null,
    };
    this.nameRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  componentDidMount() {
    registerEscHandler(this.props.close);
  }

  componentWillUnmount() {
    unregisterEscHandler();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Organization Settings</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <div className="field">
            <label className="label">Project Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Project Name"
                ref={this.nameRef}
                disabled={this.state.disabled} />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Description"
                ref={this.descriptionRef}
                disabled={this.state.disabled} />
            </div>
          </div>

          <div className="buttons">
            <button className="button" onClick={() => this.setState({ redirect: '/organizations/' + this.props.organization.organizationID + '/manage' })}>
              <span className="icon">
                <i className="fas fa-user"></i>
              </span>
              <span>Manage Users</span>
            </button>

            <button className="button is-danger" onClick={this.props.showDeletePrompt}>
              <span className="icon">
                <i className="fas fa-trash"></i>
              </span>
              <span>Delete Project</span>
            </button>
          </div>
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.submitSettings}>
            Update
          </button>

          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage &&
            <p className="help is-danger">{this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  submitSettings = async () => {
    if (this.nameRef.current === null || this.descriptionRef.current === null) {
      return;
    }

    try {
      this.setState({
        disabled: true,
      });

      const { organizationID } = this.props.organization;
      const name = this.nameRef.current.value;
      const description = this.descriptionRef.current.value;

      const organization = await this.props.backend.editOrganization(this.props.token, organizationID, name, description);
      this.props.success(organization);
    } catch (err) {
      // TODO properly display message
      this.setState({
        disabled: false,
        errorMessage: 'Failed to update settings.',
      });
    }
  }
}
