import moment from 'moment';
import React from 'react';
import { Backend } from '../Data/Backend';
import { Comment } from '../Models/Comment';
import { File } from '../Models/File';
import CreateCommentBox, { CreateCommentMode } from './CreateCommentBox';
import EditDeleteDropdown from './EditDeleteDropdown';

interface Props {
  backend: Backend;
  comment: Comment;
  deleteCommentClicked: (comment: Comment) => void;
  file: File;
  owned: boolean;
  token: string;
  updateComment: (comment: Comment) => void;
}

interface State {
  editVisible: boolean;
}

export default class CommentDisplayBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editVisible: false,
    };
  }

  render() {
    const localizedTimeString = moment(this.props.comment.published).fromNow();

    return (<article className="media">
      <figure className="media-left">
      </figure>

      <div className="media-content">
        <div className="content">
          <strong><i className="fas fa-user"></i> {this.props.comment.user.email}</strong>
          <br />
          <small><i className="fas fa-clock"></i> {localizedTimeString}</small>
          <br />
          {this.props.comment.content}
        </div>

        {this.state.editVisible &&
          <CreateCommentBox
            backend={this.props.backend}
            file={this.props.file}
            mode={CreateCommentMode.Edit}
            originalComment={this.props.comment}
            pushComment={this.props.updateComment}
            success={this.updateComment}
            token={this.props.token}
          />
        }
      </div>

      {this.props.owned &&
        <div className="media-right">
          <EditDeleteDropdown
            editClicked={this.editOnClick}
            deleteClicked={() => this.props.deleteCommentClicked(this.props.comment)}
          />
        </div>
      }
    </article>);
  }

  editOnClick = () => {
    this.setState({
      editVisible: true,
    });
  }

  updateComment = (comment: Comment) => {
    this.setState({
      editVisible: false,
    });
    this.props.updateComment(comment);
  }
}
