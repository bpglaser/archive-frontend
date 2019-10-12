import React from 'react';
import { Backend } from '../../Data/Backend';
import { Organization } from '../../Models/Organization';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';

interface Props {
  backend: Backend;
  close: () => void;
  success: (organization: Organization) => void;
  token: string;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
}

export default class CreateOrganizationPrompt extends React.Component<Props, State> {
  nameRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;

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
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Create New Organization</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <div className="field">
            <label className="label">Organization Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Organization Name"
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
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.submitNewOrganization}>
            Create
          </button>
          <button className="button" onClick={this.props.close}>Cancel</button>
        </footer>
      </div>
    </div>);
  }

  submitNewOrganization = async () => {
    if (this.nameRef.current === null || this.descriptionRef.current === null) {
      return;
    }

    try {
      this.setState({
        disabled: true,
      });

      const name = this.nameRef.current.value;
      const description = this.descriptionRef.current.value;

      const newOrganization = await this.props.backend.createOrganization(this.props.token, name, description);
      this.props.success(newOrganization);
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to create organization',
        disabled: false,
      });
    }
  }
}
