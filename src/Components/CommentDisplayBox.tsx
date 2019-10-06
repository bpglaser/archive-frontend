import React from 'react';
import { Comment } from '../Models/Comment';
import moment from 'moment';

interface Props {
  comment: Comment;
}

interface State {

}

export default class CommentDisplayBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {

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
      </div>
    </article>);
  }
}
