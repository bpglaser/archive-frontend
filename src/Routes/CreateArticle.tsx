import React from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';
import CreateArticleConfrimationPrompt from '../Components/Prompts/CreateArticleConfirmationPrompt';
import { Backend } from '../Data/Backend';
import { Article } from '../Models/Article';

interface Props {
  backend: Backend;
  token: string | null;
}

interface State {
  promptVisible: boolean;
  title: string;
  value: EditorValue;
}

export default class CreateArticle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      promptVisible: false,
      title: '',
      value: RichTextEditor.createEmptyValue(),
    };
  }

  render() {
    return (<div>
      <h1 className="title">Create a new article</h1>

      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Title"
            onChange={this.titleOnChange}
          />
        </div>
      </div>

      <div className="buttons">
        <button className="button is-success" onClick={this.showPrompt}>Create Article</button>
      </div>

      <RichTextEditor
        onChange={this.editorOnChange}
        value={this.state.value}
      />

      {this.state.promptVisible &&
        <CreateArticleConfrimationPrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          success={this.articleCreatedSuccess}
          title={this.state.title}
          token={this.props.token!}
          value={this.state.value}
        />
      }
    </div>);
  }

  articleCreatedSuccess = (article: Article) => {
    this.hidePrompt();
    // TODO redirect
  }


  editorOnChange = (value: EditorValue) => {
    this.setState({
      value: value,
    });
  }

  hidePrompt = () => {
    this.setState({
      promptVisible: false,
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
