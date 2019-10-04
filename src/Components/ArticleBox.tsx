import React from 'react';
import { Article } from '../Models/Article';
import moment from 'moment';
import { Link } from 'react-router-dom';

interface Props {
  article: Article;
}

export default class ArticleBox extends React.Component<Props> {
  render() {
    // TODO handle updated date
    const { articleID, headline, author, content, published } = this.props.article;

    return (<div className="box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{headline}</strong> <small><i className="fas fa-user"></i> {author.email}</small> <small><i className="fas fa-clock"></i> {getLocalizedTimeString(published)}</small>
              <br />
              {content}
              <br />
              <Link to={'/article/' + articleID}>Read more...</Link>
            </p>
          </div>
        </div>
      </article>
    </div>);
  }
}

function getLocalizedTimeString(d: Date) {
  return moment(d).fromNow();
}
