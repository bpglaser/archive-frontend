import React from 'react';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';

interface Props {
  backend: Backend;
  displayError: (s: string) => void;
  file: File;
  tagsUpdated: (tags: string[]) => void;
  tags: string[];
  token: string | null;
}

interface State {
  awaitingResponse: boolean;
  editMode: boolean;
  newTagValue: string;
}

export default class Tags extends React.Component<Props, State> {
  readonly newTagInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      awaitingResponse: false,
      editMode: false,
      newTagValue: '',
    };
    this.newTagInputRef = React.createRef();
  }

  requestInputFocus = () => {
    if (this.newTagInputRef.current) {
      this.newTagInputRef.current.focus();
    }
  }

  componentDidUpdate(_oldProps: Props, oldState: State) {
    if (!oldState.editMode && this.state.editMode) {
      this.requestInputFocus();
    }
  }

  render() {
    return (<div style={{ marginBottom: '1em' }}>
      <div className="tags">
        {this.props.tags.length > 0 &&
          this.props.tags.map((entry, i) =>
            <span className="tag" key={i}>
              {entry}
              {this.state.editMode &&
                <button className="delete is-small" onClick={() => this.deleteTagClicked(i)} disabled={this.state.awaitingResponse} />
              }
            </span>
          )
        }

        {this.props.tags.length === 0 &&
          <span className="tag">
            No Tags
          </span>
        }

        {this.props.token && !this.state.editMode &&
          <span className="tag">
            <button className="transparent-button" onClick={this.showEditBox} title="Edit Tags">
              <span className="icon is-small">
                <i className="fas fa-edit fa-sm"></i>
              </span>
            </button>
          </span>
        }

        {this.state.editMode &&
          <span className="tag" style={{ alignItems: 'baseline' }}>
            <div className="field">
              <div className="control">
                <input
                  className="input is-small is-rounded"
                  type="text"
                  placeholder="New Tag"
                  ref={this.newTagInputRef}
                  value={this.state.newTagValue}
                  onChange={this.handleTagValueOnChange}
                  disabled={this.state.awaitingResponse}
                />
              </div>
            </div>

            <button className="transparent-button" onClick={this.hideEditBox} title="Cancel">
              <span className="icon is-small has-text-danger">
                <i className="fas fa-times-circle fa-sm"></i>
              </span>
            </button>

            <button className="transparent-button" onClick={this.newTagClicked} title="Add Tag" disabled={this.state.awaitingResponse}>
              <span className="icon is-small has-text-success">
                <i className="fas fa-check-circle fa-sm"></i>
              </span>
            </button>
          </span>
        }
      </div>
    </div>);
  }

  deleteTagClicked = async (tagIndex: number) => {
    this.setState({
      awaitingResponse: true,
    });

    try {
      const tag = this.props.tags[tagIndex];
      this.props.backend.deleteTag(this.props.token!, this.props.file.fileID, tag);

      const newTags = [...this.props.tags];
      newTags.splice(tagIndex, 1);
      this.props.tagsUpdated(newTags);
    } catch (err) {
      console.log(err);
      this.props.displayError('Failed to delete tag.');
    }

    this.setState({
      awaitingResponse: false,
    });
  }

  newTagClicked = async () => {
    if (this.state.newTagValue.trim() === '') {
      return;
    }

    this.setState({
      awaitingResponse: true,
    });

    try {
      const tag = this.state.newTagValue;
      this.props.backend.addTag(this.props.token!, this.props.file.fileID, tag);

      this.setState({
        newTagValue: ''
      });
      this.requestInputFocus();
      const newTags = [...this.props.tags, this.state.newTagValue];
      this.props.tagsUpdated(newTags);
    } catch (err) {
      console.log(err);
      this.props.displayError('Failed to add new tag.');
    }

    this.setState({
      awaitingResponse: false,
    });
  }

  handleTagValueOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newTagValue: event.target.value,
    });
  }

  hideEditBox = () => {
    this.setState({
      editMode: false,
      newTagValue: '',
    });
  }

  showEditBox = () => {
    this.setState({
      editMode: true,
    });
  }
}
