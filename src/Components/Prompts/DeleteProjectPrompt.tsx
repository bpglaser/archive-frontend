import React from 'react';
import { Backend } from '../../Data/Backend';
import { Project } from '../../Models/Project';
import { Organization } from '../../Models/Organization';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';

interface Props {
  backend: Backend;
  close: () => void;
  organization: Organization;
  project: Project;
  success: () => void;
  token: string;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
  loading: boolean;
}

export default class DeleteProjectPrompt extends React.Component<Props, State> {
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      disabled: true,
      errorMessage: null,
      loading: false,
    };

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    registerEscHandler(this.props.close);
    this.inputRef.current!.focus();
  }

  componentWillUnmount() {
    unregisterEscHandler();
  }

  render() {
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Delete Project</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <h1>Are you sure you want to delete <strong>{this.props.organization.name}/{this.props.project.name}</strong>?</h1>
          <br />
          <div className="field">
            <label className="label">Please type the project's full name to delete.</label>
            <div className="control has-icons-left">
              <input className="input" type="text" placeholder={this.props.project.name} ref={this.inputRef} onChange={this.handleInputChange} />
              <span className="icon is-small is-left">
                <i className="fas fa-folder"></i>
              </span>
            </div>
          </div>
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.loading ? "button is-danger is-loading" : "button is-danger"}
            disabled={this.state.loading || this.state.disabled}
            onClick={this.deleteProject}>
            Delete
          </button>
          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage &&
            <p className="help is-danger">{this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  deleteProject = async () => {
    this.setState({
      loading: true,
    });

    try {
      await this.props.backend.deleteProject(this.props.token, this.props.project.projectID);
      this.props.success();
    } catch (err) {
      this.setState({
        errorMessage: 'Project deletion failed.',
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if the user correctly inputted the project name
    if (this.props.project.name === event.target.value) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  }
}
