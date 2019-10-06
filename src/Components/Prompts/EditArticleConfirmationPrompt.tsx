import React from 'react';
import { EditorValue } from 'react-rte';
import { Backend } from '../../Data/Backend';
import { Article } from '../../Models/Article';

interface Props {
  article: Article;
  backend: Backend;
  close: () => void;
  success: (article: Article) => void;
  title: string;
  token: string;
  value: EditorValue;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
}

export default class EditArticleConfirmationPrompt extends React.Component<Props, State> {
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
          <p className="modal-card-title">Edit Existing Article</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          Submit article changes?
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.updateArticle}>
            Update Article
          </button>
          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage !== null &&
            <p className="help is-danger">{this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  updateArticle = async () => {
    try {
      this.setState({
        disabled: true,
      });
      const content = this.props.value.toString('html');
      const article = await this.props.backend.updateArticle(this.props.token, this.props.article, this.props.title, content);
      this.props.success(article);
    } catch (err) {
      // TODO fine tune error handling
      this.setState({
        disabled: false,
        errorMessage: 'Failed to update article.',
      });
    }
  }
}