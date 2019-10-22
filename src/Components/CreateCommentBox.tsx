import React, { ChangeEvent } from 'react';
import { Backend } from '../Data/Backend';
import { Comment } from '../Models/Comment';
import { File } from '../Models/File';

export enum CreateCommentMode {
  Create,
  Edit,
}

interface Props {
  backend: Backend;
  file: File;
  pushComment: (comment: Comment) => void;
  mode: CreateCommentMode;
  originalComment?: Comment;
  success: (comment: Comment) => void;
  token: string;
}

interface State {
  awaitingResponse: boolean;
  commentContent: string;
  errorMessage: string | null;
  submitDisabled: boolean;
}

export default class CreateCommentBox extends React.Component<Props, State> {
  readonly contentRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      awaitingResponse: false,
      commentContent: this.props.originalComment ? this.props.originalComment.content : '',
      errorMessage: null,
      submitDisabled: true,
    };
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    const current = this.contentRef.current;
    if (current) {
      current.focus();
      // Jump the cursor to the end of the selection
      const i = current.value.length;
      current.setSelectionRange(i, i);
    }
  }

  render() {
    const label =
      this.props.mode === CreateCommentMode.Create
        ? 'Leave a comment' : 'Edit existing comment';

    return (<div>
      <div className="field">
        <div className="label">{label}</div>
        <div className="control">
          <textarea
            className="textarea"
            disabled={this.state.awaitingResponse}
            onChange={this.commentOnChange}
            placeholder="Comment"
            ref={this.contentRef}
            value={this.state.commentContent}
          />
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button
            className={this.state.awaitingResponse ? "button is-primary is-loading" : "button is-primary"}
            disabled={this.state.awaitingResponse || this.state.submitDisabled}
            onClick={this.submitComment}
          >
            Submit
          </button>
        </div>
      </div>

      {this.state.errorMessage &&
        <p className="help is-danger">{this.state.errorMessage}</p>
      }
    </div>);
  }

  commentOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    this.setState({
      commentContent: value,
      submitDisabled: value.trim() === '',
    });
  }

  submitComment = async () => {
    this.setState({
      awaitingResponse: true,
      errorMessage: null,
    });

    try {
      let response: Comment;
      switch (this.props.mode) {
        case CreateCommentMode.Create:
          response = await this.props.backend.submitComment(this.props.token, this.props.file.fileID, this.state.commentContent);
          break;
        case CreateCommentMode.Edit:
          response = await this.props.backend.editComment(this.props.token, this.props.originalComment!.commentID, this.state.commentContent);
          break;
        default:
          throw new Error('Unreachable mode encountered');
      }
      this.props.success(response);
      this.setState({
        commentContent: '',
        submitDisabled: true,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Failed to create comment.',
      });
    }

    this.setState({
      awaitingResponse: false,
    });
  }
}
