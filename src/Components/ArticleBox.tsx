import moment from 'moment';
import React from 'react';
import ReactHTMLParser from 'react-html-parser';
import { Link, Redirect } from 'react-router-dom';
import { Backend } from '../Data/Backend';
import { readTokenPayload } from '../Helpers';
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
  redirectToEdit: boolean;
  promptVisible: boolean;
}

export default class ArticleBox extends React.Component<Props, State> {
  readonly isAdmin: boolean;

  constructor(props: Props) {
    super(props);
    this.state = {
      redirectToEdit: false,
      promptVisible: false,
    };

    if (this.props.token) {
      const user = readTokenPayload(this.props.token);
      this.isAdmin = user.admin !== undefined && user.admin;
    } else {
      this.isAdmin = false;
    }
  }

  render() {
    if (this.state.redirectToEdit) {
      return <Redirect to={'/article/edit/' + this.props.article.articleID} />
    }
    // TODO handle updated date
    const { articleID, headline, author, snippet, published } = this.props.article;
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
                  {ReactHTMLParser(snippet!)}
                  <br />
                  <Link to={'/article/' + articleID}>Read more...</Link>
                </p>
              </div>
            </div>
          </article>
        </div>

        {this.isAdmin &&
          <div className="column is-narrow">
            <ArticleDropdown
              editClicked={this.editClicked}
              deleteClicked={this.deleteClicked}
            />
          </div>
        }
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
    if (!this.isAdmin) {
      return;
    }
    this.setState({
      redirectToEdit: true,
    });
  }

  deleteClicked = () => {
    if (!this.isAdmin) {
      return;
    }

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
