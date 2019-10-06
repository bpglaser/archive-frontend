import React from 'react';
import { Backend } from '../../Data/Backend';
import { Article } from '../../Models/Article';

interface Props {
  article: Article;
  backend: Backend;
  close: () => void;
  success: () => void;
  token: string;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
}

export default class DeleteArticleConfirmationPrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
      errorMessage: null,
    };
  }

  render() {
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Delete Article</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          Are you sure you want to delete the article titled <strong>{this.props.article.headline}</strong>?
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-danger is-loading" : "button is-danger"}
            disabled={this.state.disabled}
            onClick={this.deleteArticle}>
            Delete Article
          </button>
          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage !== null &&
            <p className="help is-danger">{this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  deleteArticle = async () => {
    try {
      this.setState({
        disabled: true,
      });
      await this.props.backend.deleteArticle(this.props.token, this.props.article.articleID);
      this.props.success();
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to delete article.',
        disabled: false,
      });
    }
  }
}
