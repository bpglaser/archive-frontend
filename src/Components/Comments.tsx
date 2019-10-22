import React from 'react';
import { Backend } from '../Data/Backend';
import { Comment } from '../Models/Comment';
import { File } from '../Models/File';
import CommentDisplayBox from './CommentDisplayBox';
import CreateCommentBox, { CreateCommentMode } from './CreateCommentBox';
import ErrorPage from './ErrorPage';
import Loader from './Loader';
import { readTokenPayload } from '../Helpers';
import DeleteCommentConfirmationPrompt from './Prompts/DeleteCommentConfirmationPrompt';

interface Props {
  backend: Backend;
  file: File;
  token: string;
}

interface State {
  comments: Comment[];
  deleteComment: Comment | null;
  errorMessage: string | null;
  loading: boolean;
}

export default class Comments extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      comments: [],
      deleteComment: null,
      errorMessage: null,
      loading: true,
    };
  }

  async componentDidMount() {
    await this.loadComments(this.props.file);
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.file !== oldProps.file) {
      await this.loadComments(this.props.file);
    }
  }

  render() {
    if (this.state.errorMessage) {
      return <ErrorPage
        errorMessage={this.state.errorMessage}
        retry={() => this.loadComments(this.props.file)}
      />
    }

    if (this.state.loading) {
      return <Loader />;
    }

    return (<div>
      <CreateCommentBox
        backend={this.props.backend}
        file={this.props.file}
        pushComment={this.pushComment}
        mode={CreateCommentMode.Create}
        success={this.pushComment}
        token={this.props.token}
      />

      <br />

      {
        this.state.comments.map((comment, i) =>
          <CommentDisplayBox
            backend={this.props.backend}
            comment={comment}
            deleteCommentClicked={this.deleteCommentClicked}
            file={this.props.file}
            key={i}
            owned={this.isCommentOwned(comment)}
            token={this.props.token}
            updateComment={this.updateComment}
          />
        )
      }

      {this.state.deleteComment &&
        <DeleteCommentConfirmationPrompt
          backend={this.props.backend}
          close={this.closePrompt}
          comment={this.state.deleteComment}
          success={this.commentDeleted}
          token={this.props.token}
        />
      }
    </div>);
  }

  closePrompt = () => {
    this.setState({
      deleteComment: null,
    });
  }

  commentDeleted = (comment: Comment) => {
    this.setState({
      comments: this.state.comments.filter((c) => c !== comment),
      deleteComment: null,
    });
  }

  deleteCommentClicked = (comment: Comment) => {
    this.setState({
      deleteComment: comment,
    });
  }

  loadComments = async (file: File) => {
    this.setState({
      loading: true,
    });

    try {
      const comments = await this.props.backend.getComments(this.props.token, file.fileID);
      // TODO sort comments
      this.setState({
        comments: comments,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Failed to load comments.',
      });
    }

    this.setState({
      loading: false,
    });
  }

  pushComment = (comment: Comment) => {
    const newComments = [comment, ...this.state.comments];
    // TODO sort comments
    this.setState({
      comments: newComments,
    });
  }

  isCommentOwned = (comment: Comment) => {
    const user = readTokenPayload(this.props.token);
    return user.userID === comment.user.userID;
  }

  updateComment = (comment: Comment) => {
    const newComments = [...this.state.comments];
    const i = newComments.findIndex((c) => c.commentID === comment.commentID);
    newComments[i] = comment;
    // TODO maybe sort?
    this.setState({
      comments: newComments,
    });
  }
}
