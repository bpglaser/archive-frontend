import React from 'react';
import { Backend } from '../../Data/Backend';
import { registerEscHandler, unregisterEscHandler, createErrorMessage } from '../../Helpers';
import { File } from '../../Models/File';

interface Props {
  backend: Backend;
  close: () => void;
  file: File;
  success: () => void;
  token: string;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
}

export default class FileDeletePrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
      errorMessage: null,
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
          <p className="modal-card-title">Delete File</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          Are you sure you want to delete <strong>{this.props.file.name}</strong>?
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-danger is-loading" : "button is-danger"}
            disabled={this.state.disabled}
            onClick={this.deleteComment}>
            Delete File
          </button>
          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage !== null &&
            <p className="help is-danger">{this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  deleteComment = async () => {
    this.setState({
      disabled: true,
    });

    try {
      await this.props.backend.deleteFile(this.props.token, this.props.file.fileID);
      this.props.success();
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: createErrorMessage(err, 'Failed to delete file.'),
        disabled: false,
      });
    }
  }
}
