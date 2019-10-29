import React from 'react';
import { Backend } from '../../Data/Backend';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';
import { File } from '../../Models/File';

interface Props {
  backend: Backend;
  close: () => void;
  file: File;
  showDeletePrompt: () => void;
  success: (file: File) => void;
  token: string;
}

interface State {
  description: string;
  disabled: boolean;
  errorMessage: string | null;
  name: string;
}

export default class FileSettingsPrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      description: '',
      disabled: false,
      errorMessage: null,
      name: this.props.file.name,
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
          <p className="modal-card-title">File Settings</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Project Name"
                value={this.state.name}
                onChange={this.nameUpdated}
                disabled={this.state.disabled}
              />
            </div>
          </div>

          <button className="button is-danger" onClick={this.props.showDeletePrompt}>
            <span className="icon">
              <i className="fas fa-trash"></i>
            </span>
            <span>Delete File</span>
          </button>
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.submitChanges}>
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

  submitChanges = async () => {
    this.setState({
      disabled: true,
    });

    try {
      const file = await this.props.backend.updateFile(this.props.token, this.props.file, this.state.name);
      this.props.success(file);
    } catch (err) {
      this.setState({
        disabled: false,
        errorMessage: 'Failed to update filename.',
      });
    }
  }

  nameUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value,
    });
  }
}
