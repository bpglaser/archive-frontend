import React from 'react';
import { Backend } from '../Data/Backend';
import { Comment } from '../Models/Comment';
import { File } from '../Models/File';
import CommentDisplayBox from './CommentDisplayBox';
import Loader from './Loader';

interface Props {
  backend: Backend;
  file: File;
  token: string;
}

interface State {
  comments: Comment[];
  loading: boolean;
}

export default class Comments extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await this.loadComments(this.props.file);
    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    return (<div>
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
    try {
      const comments = await this.props.backend.getComments(this.props.token, file.fileID);
      this.setState({
        comments: comments,
      });
    } catch (err) {
      // TODO handle errr
    }
  }
}