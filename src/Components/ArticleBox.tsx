import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Backend } from '../Data/Backend';
import { Article } from '../Models/Article';
import ArticleDropdown from './ArticleDropdown';
import DeleteArticleConfirmationPrompt from './Prompts/DeleteArticleConfirmationPrompt';

interface Props {
  article: Article;
  articleDeleted: (article: Article) => void;
  backend: Backend;
  token: string | null;
}

interface State {
  promptVisible: boolean;
}

export default class ArticleBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      promptVisible: false,
    };
  }

  render() {
    // TODO handle updated date
    const { articleID, headline, author, content, published } = this.props.article;
    const localizedTimeString = moment(published).fromNow();

    return (<div className="box">
      <div className="columns">
        <div className="column">
          <article className="media">
            <div className="media-content">
              <div className="content">
                <p>
                  <strong>{headline}</strong> <small><i className="fas fa-user"></i> {author.email}</small> <small><i className="fas fa-clock"></i> {localizedTimeString}</small>
                  <br />
                  {content}
                  <br />
                  <Link to={'/article/' + articleID}>Read more...</Link>
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="column is-narrow">
          <ArticleDropdown
            editClicked={this.editClicked}
            deleteClicked={this.deleteClicked}
          />
        </div>
      </div>

      {this.state.promptVisible &&
        <DeleteArticleConfirmationPrompt
          article={this.props.article}
          backend={this.props.backend}
          close={this.hidePrompt}
          success={this.articleDeleted}
          token={this.props.token!}
        />
      }
    </div>);
  }

  articleDeleted = () => {
    this.hidePrompt();
    this.props.articleDeleted(this.props.article);
  }

  editClicked = () => {
    // TODO
  }

  deleteClicked = () => {
    this.setState({
      promptVisible: true,
    });
  }

  hidePrompt = () => {
    this.setState({
      promptVisible: false,
    });
  }
}
