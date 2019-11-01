import * as React from "react";
import { Backend } from "../../Data/Backend";
import { Project } from "../../Models/Project";
import { File } from '../../Models/File';
import { registerEscHandler, unregisterEscHandler } from "../../Helpers";

interface Props {
  backend: Backend;
  close: () => void;
  closeWithSuccess: (file: File) => void;
  project: Project;
  token: string;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
  selectedFile: string | null;
}

export default class UploadFilePrompt extends React.Component<Props, State> {
  readonly fileInputRef: React.RefObject<HTMLInputElement>;
  readonly nameInputRef: React.RefObject<HTMLInputElement>;
  readonly noteTextareaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props)
    this.fileInputRef = React.createRef();
    this.nameInputRef = React.createRef();
    this.noteTextareaRef = React.createRef();
    this.state = {
      disabled: false,
      errorMessage: null,
      selectedFile: null,
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
          <p className="modal-card-title">Upload</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <div className="file has-name is-fullwidth">
            <label className="file-label">
              <input
                className="file-input"
                accept=".bmp,.fit,.fits,.gif,.jpg,.jpeg,.png"
                disabled={this.state.disabled}
                type="file"
                name="image"
                onChange={this.fileUpdated}
                ref={this.fileInputRef} />

              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">
                  Choose a file…
                </span>
              </span>

              <span className="file-name">
                {this.state.selectedFile !== null ? this.state.selectedFile : ""}
              </span>
            </label>
          </div>

          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input className="input" type="text" placeholder="Name" disabled={this.state.disabled} ref={this.nameInputRef} />
            </div>
          </div>

          <div className="field">
            <label className="label">Note</label>
            <div className="control">
              <textarea className="textarea" placeholder="Note" disabled={this.state.disabled} ref={this.noteTextareaRef}></textarea>
            </div>
          </div>
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.modifyClassNameForDisabled("button is-success")}
            disabled={this.state.disabled}
            onClick={this.startUpload}>
            Upload
          </button>

          <button
            className="button"
            onClick={this.props.close}>
            Cancel
          </button>

          {this.state.errorMessage !== null &&
            <p className="help is-danger">Error: {this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  disableInteractivity = () => {
    this.setState({
      disabled: true,
    });
  }

  displayError = (error: any) => {
    this.setState({
      errorMessage: String(error),
    });
  }

  enableInteractivity = () => {
    this.setState({
      disabled: false,
    });
  }

  fileUpdated = () => {
    if (this.fileInputRef.current !== null) {
      const files = this.fileInputRef.current.files;
      if (files === null || files.length === 0) {
        return;
      }

      if (this.nameInputRef.current !== null && this.nameInputRef.current.value === '') {
        this.nameInputRef.current.value = files[0].name;
      }

      this.setState({
        selectedFile: files[0].name,
      });
    }
  }

  modifyClassNameForDisabled = (s: string): string => {
    if (this.state.disabled) {
      return s + ' is-loading';
    }
    return s;
  }

  startUpload = async () => {
    if (this.fileInputRef.current!.files === null || this.fileInputRef.current!.files.length === 0) {
      // TODO
      return;
    }

    try {
      const { backend, project, token } = this.props;
      this.disableInteractivity();

      const formData = new FormData();
      formData.append('name', this.nameInputRef.current!.value);
      formData.append('note', this.noteTextareaRef.current!.value);
      const file = this.fileInputRef.current!.files[0];
      formData.append('image', file);

      const result = await backend.uploadFile(token, project.projectID, formData);
      this.props.closeWithSuccess(result);
    } catch (error) {
      this.displayError(error);
      this.enableInteractivity();
    }
  }
}
