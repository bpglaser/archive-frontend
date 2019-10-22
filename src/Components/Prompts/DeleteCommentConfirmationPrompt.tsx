import React from 'react';
import { Backend } from '../../Data/Backend';
import { Comment } from '../../Models/Comment';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';

interface Props {
  backend: Backend;
  close: () => void;
  comment: Comment;
  success: (comment: Comment) => void;
  token: string;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
}

export default class DeleteCommentConfirmationPrompt extends React.Component<Props, State> {
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
          <p className="modal-card-title">Delete Comment</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          Are you sure you want to delete the comment?
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-danger is-loading" : "button is-danger"}
            disabled={this.state.disabled}
            onClick={this.deleteComment}>
            Delete Comment
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
      await this.props.backend.deleteComment(this.props.token, this.props.comment.commentID);
      this.props.success(this.props.comment);
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to delete article.',
        disabled: false,
      });
    }
  }
}
