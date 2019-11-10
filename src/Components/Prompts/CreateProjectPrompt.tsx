import React from 'react';
import { Backend } from '../../Data/Backend';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';
import { Organization } from '../../Models/Organization';
import { Project } from '../../Models/Project';
import PublicToggleButton from '../PublicToggleButton';

interface Props {
  backend: Backend;
  close: () => void;
  organization: Organization;
  success: (project: Project) => void;
  token: string;
}

interface State {
  description: string;
  disabled: boolean;
  errorMessage: string | null;
  name: string;
  isPublic: boolean;
}

export default class CreateProjectPrompt extends React.Component<Props, State> {
  readonly nameRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
      description: '',
      errorMessage: null,
      name: '',
      isPublic: false,
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
                disabled={this.state.disabled}
                onChange={this.nameOnChange}
                value={this.state.name}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Description"
                disabled={this.state.disabled}
                onChange={this.descriptionOnChange}
                value={this.state.description}
              />
            </div>
          </div>

          <div className="field">
            <PublicToggleButton
              isPublic={this.state.isPublic}
              toggle={this.toggleIsPublic}
            />
          </div>
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.submitNewProject}
          >
            Create
          </button>

          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage &&
            <span className="help is-danger">{this.state.errorMessage}</span>
          }
        </footer>
      </div>
    </div>);
  }

  submitNewProject = async () => {
    if (this.state.name.trim() === '') {
      this.setState({
        errorMessage: 'Project name must not be blank.',
      });
      return;
    };

    this.setState({
      disabled: true,
      errorMessage: null,
    });

    try {
      const { organizationID } = this.props.organization;
      const project = await this.props.backend.createProject(this.props.token, organizationID, this.state.name, this.state.description, this.state.isPublic);
      this.props.success(project);
    } catch (err) {
      console.log(err);
      this.setState({
        disabled: false,
        errorMessage: 'An error was encountered while creating the project.',
      });
    }
  }

  nameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      errorMessage: null,
      name: event.target.value,
    });
  }

  descriptionOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      description: event.target.value,
      errorMessage: null,
    });
  }

  toggleIsPublic = () => {
    this.setState((oldState) => ({
      errorMessage: null,
      isPublic: !oldState.isPublic,
    }));
  }
}
