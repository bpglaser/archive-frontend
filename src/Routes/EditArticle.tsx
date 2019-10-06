import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import RichTextEditor, { EditorValue } from 'react-rte';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import EditArticleConfirmationPrompt from '../Components/Prompts/EditArticleConfirmationPrompt';
import { Backend } from '../Data/Backend';
import { Article } from '../Models/Article';

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  token: string | null;
}

interface State {
  article: Article | null;
  errorMessage: string | null;
  loading: boolean;
  needsRedirect: boolean;
  promptVisible: boolean;
  title: string;
  value: EditorValue;
}

export default class EditArticle extends React.Component<Props, State> {
  readonly id: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      article: null,
      errorMessage: null,
      loading: true,
      needsRedirect: false,
      promptVisible: false,
      title: '',
      value: EditorValue.createEmpty(),
    };
    this.id = Number(this.props.match.params.id);
  }

  async componentDidMount() {
    await this.loadArticle();
    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.errorMessage) {
      return <ErrorPage errorMessage={this.state.errorMessage} retry={this.reloadArticle} />;
    }

    if (this.state.needsRedirect) {
      return <Redirect to={'/article/' + this.id} />
    }

    // TODO redirect non-admin

    return (<div>
      <h1 className="title">Edit existing article</h1>

      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Title"
            onChange={this.titleOnChange}
            value={this.state.title}
          />
        </div>
      </div>

      <div className="buttons">
        <button className="button is-success" onClick={this.showPrompt}>Update Article</button>
      </div>

      <RichTextEditor
        onChange={this.editorOnChange}
        value={this.state.value}
      />

      {this.state.promptVisible &&
        <EditArticleConfirmationPrompt
          article={this.state.article!}
          backend={this.props.backend}
          close={this.closePrompt}
          success={this.articleUpdated}
          title={this.state.title}
          token={this.props.token!}
          value={this.state.value}
        />
      }
    </div>);
  }

  articleUpdated = (article: Article) => {
    this.setState({
      article: article,
      needsRedirect: true,
      promptVisible: false,
    });
  }

  closePrompt = () => {
    this.setState({
      promptVisible: false,
    });
  }

  editorOnChange = (value: EditorValue) => {
    this.setState({
      value: value,
    });
  }

  loadArticle = async () => {
    try {
      const article = await this.props.backend.getArticle(this.id);
      this.setState({
        article: article,
        title: article.headline,
        value: EditorValue.createFromString(article.content, 'html'),
      });
    } catch (err) {
      // TODO fine tune error handling
      this.setState({
        errorMessage: 'An error occoured while loading the article contents.',
      });
    }
  }

  reloadArticle = async () => {
    this.setState({
      errorMessage: null,
      loading: true,
    });

    await this.loadArticle();

    this.setState({
      loading: false,
    });
  }

  showPrompt = () => {
    this.setState({
      promptVisible: true,
    });
  }

  titleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
    });
  }
}
