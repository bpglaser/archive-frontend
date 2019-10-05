import React from 'react';
import { EditorValue } from 'react-rte';
import { Backend } from '../../Data/Backend';
import { Article } from '../../Models/Article';

interface Props {
  backend: Backend;
  close: () => void;
  success: (article: Article) => void;
  title: string;
  token: string;
  value: EditorValue;
}

interface State {
  disabled: boolean;
}

export default class CreateArticleConfrimationPrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  render() {
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Create New Article</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        {this.props.title &&
          <section className="modal-card-body">
            Are you sure you want to create an article titled <strong>{this.props.title}</strong>?
          </section>
        }

        {!this.props.title &&
          <section className="modal-card-body">
            Are you sure you want to create an article <strong>without</strong> a title?
          </section>
        }

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.createNewArticle}>
            Create Article
          </button>
          <button className="button" onClick={this.props.close}>Cancel</button>
        </footer>
      </div>
    </div>);
  }

  createNewArticle = async () => {
    try {
      this.setState({
        disabled: true,
      });
      const content = this.props.value.toString('html');
      const article = await this.props.backend.createArticle(this.props.token, this.props.title, content);
      this.props.success(article);
    } catch (err) {
      this.setState({
        disabled: false,
      });
    }
  }
}
