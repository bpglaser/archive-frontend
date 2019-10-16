import React, { ChangeEvent } from 'react';
import { Backend } from '../Data/Backend';
import { Comment } from '../Models/Comment';

interface Props {
  backend: Backend;
  pushComment: (comment: Comment) => void;
  token: string;
}

interface State {
  awaitingResponse: boolean;
  commentContent: string;
  errorMessage: string | null;
  submitDisabled: boolean;
}

export default class CreateCommentBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      awaitingResponse: false,
      commentContent: '',
      errorMessage: null,
      submitDisabled: true,
    };
  }

  render() {
    return (<div>
      <div className="field">
        <div className="label">Leave a comment</div>
        <div className="control">
          <textarea
            className="textarea"
            disabled={this.state.awaitingResponse}
            placeholder="Comment"
            onChange={this.commentOnChange}
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
      const response = await this.props.backend.submitComment(this.props.token, this.state.commentContent);
      this.props.pushComment(response);
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

