import React from 'react';
import { Backend } from '../Data/Backend';
import { Comment } from '../Models/Comment';
import { File } from '../Models/File';
import CommentDisplayBox from './CommentDisplayBox';
import CreateCommentBox from './CreateCommentBox';
import ErrorPage from './ErrorPage';
import Loader from './Loader';

interface Props {
  backend: Backend;
  file: File;
  token: string;
}

interface State {
  comments: Comment[];
  errorMessage: string | null;
  loading: boolean;
}

export default class Comments extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      comments: [],
      errorMessage: null,
      loading: true,
    };
  }

  async componentDidMount() {
    await this.loadComments(this.props.file);
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
        token={this.props.token}
      />

      <br />

      {
        this.state.comments.map((comment, i) =>
          <CommentDisplayBox
            comment={comment}
            key={i}
          />
        )
      }
    </div>);
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
}
