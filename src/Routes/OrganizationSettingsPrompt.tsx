import React from 'react';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';

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
}

export default class OrganizationSettingsPrompt extends React.Component<Props, State> {
  render() {
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Project Settings</p>
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
                // ref={this.nameRef}
                disabled={this.state.disabled} />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Description"
                // ref={this.descriptionRef}
                disabled={this.state.disabled} />
            </div>
          </div>

          <button className="button is-danger" onClick={this.props.showDeletePrompt}>
            <span className="icon">
              <i className="fas fa-trash"></i>
            </span>
            <span>Delete Project</span>
          </button>
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
}
