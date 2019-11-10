import React from 'react';
import { Backend } from '../../Data/Backend';
import { Project } from '../../Models/Project';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';
import PublicToggleButton from '../PublicToggleButton';

interface Props {
  backend: Backend;
  close: () => void;
  project: Project;
  showDeletePrompt: () => void;
  success: (project: Project) => void;
  token: string;
}

interface State {
  description: string;
  disabled: boolean;
  errorMessage: string | null;
  isPublic: boolean,
  name: string;
}

export default class ProjectSettingsPrompt extends React.Component<Props, State> {
  readonly nameRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      description: props.project.description,
      disabled: false,
      errorMessage: null,
      isPublic: false, // TODO populate from props
      name: props.project.name,
    };
    this.nameRef = React.createRef();
  }

  componentDidMount() {
    registerEscHandler(this.props.close);
    if (this.nameRef.current) {
      this.nameRef.current.focus();
    }
  }

  componentWillUnmount() {
    unregisterEscHandler();
  }

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
                value={this.state.name}
                onChange={this.nameUpdated}
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
                value={this.state.description}
                onChange={this.descriptionUpdated}
                disabled={this.state.disabled} />
            </div>
          </div>

          <div className="field">
            <PublicToggleButton
              isPublic={this.state.isPublic}
              toggle={this.toggleIsPublic}
            />
            
          </div>

          <div className="field">
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
    if (this.state.name.trim() === '') {
      this.setState({
        errorMessage: 'Project name must not be empty.',
      });
      return;
    }

    try {
      this.setState({
        disabled: true,
        errorMessage: null,
      });

      const { projectID, organizationID } = this.props.project;

      const name = this.state.name;
      const description = this.state.description;
      const isPublic = this.state.isPublic;

      const newProject = await this.props.backend.editProject(this.props.token, projectID, organizationID, name, description, isPublic);
      this.props.success(newProject);
    } catch (err) {
      this.setState({
        disabled: false,
        errorMessage: 'Failed to update settings.',
      });
    }
  }

  nameUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value,
    });
  }

  descriptionUpdated = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      description: event.target.value,
    });
  }

  toggleIsPublic = () => {
    this.setState((oldState) => ({
      isPublic: !oldState.isPublic,
    }));
  }
}
