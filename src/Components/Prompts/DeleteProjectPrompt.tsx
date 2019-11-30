import React from 'react';
import { Backend } from '../../Data/Backend';
import { Project } from '../../Models/Project';
import { Organization } from '../../Models/Organization';
import { registerEscHandler, unregisterEscHandler, createErrorMessage } from '../../Helpers';

interface Props {
  backend: Backend;
  close: () => void;
  organization: Organization;
  project: Project;
  success: () => void;
  token: string;
}

interface State {
  errorMessage: string | null;
  loading: boolean;
}

export default class DeleteProjectPrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      loading: false,
    };
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
          <p className="modal-card-title">Delete Project</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <h1>Are you sure you want to delete <strong>{this.props.project.name}</strong>?</h1>
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.loading ? "button is-danger is-loading" : "button is-danger"}
            disabled={this.state.loading}
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
      console.log(err);
      this.setState({
        errorMessage: createErrorMessage(err, 'Project deletion failed.'),
        loading: false,
      });
    }
  }
}
