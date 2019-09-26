import React from 'react';
import { Backend } from '../../Data/Backend';
import { Organization } from '../../Models/Organization';
import { Project } from '../../Models/Project';

interface Props {
  backend: Backend;
  close: () => void;
  organization: Organization;
  success: (project: Project) => void;
  token: string;
}

interface State {
  disabled: boolean;
}

export default class CreateProjectPrompt extends React.Component<Props, State> {
  nameRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
    };
    this.nameRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  render() {
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Create New Project</p>
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
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.submitNewProject}>
            Create
              </button>
          <button className="button" onClick={this.props.close}>Cancel</button>
        </footer>
      </div>
    </div>);
  }

  submitNewProject = async () => {
    if (this.nameRef.current === null || this.descriptionRef.current === null) {
      return;
    }

    this.setState({
      disabled: true,
    });

    const { organizationID } = this.props.organization;
    const name = this.nameRef.current.value;
    const description = this.descriptionRef.current.value;
    const project = await this.props.backend.createProject(this.props.token, organizationID, name, description);

    this.setState({
      disabled: false,
    });

    this.props.success(project);
  }
}
