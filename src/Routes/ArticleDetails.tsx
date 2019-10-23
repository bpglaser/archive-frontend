import moment from 'moment';
import React from 'react';
import ReactHTMLParser from 'react-html-parser';
import { Redirect, RouteComponentProps } from 'react-router';
import EditDeleteDropdown from '../Components/EditDeleteDropdown';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import DeleteArticleConfirmationPrompt from '../Components/Prompts/DeleteArticleConfirmationPrompt';
import { Backend } from '../Data/Backend';
import { checkIsAdmin } from '../Helpers';
import { Article } from '../Models/Article';
import Breadcrumb from '../Components/Breadcrumb';

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  token: string | null;
}

interface State {
  article: Article | null;
  errorMessage: string | null;
  loading: boolean;
  promptVisible: boolean;
  redirectToEdit: boolean;
  redirectToHome: boolean;
}

export default class ArticleDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      article: null,
      errorMessage: null,
      loading: true,
      promptVisible: false,
      redirectToEdit: false,
      redirectToHome: false,
    };
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
      return (<div>
        <Breadcrumb
          links={[
            ["Unknown Article", "#"],
          ]}
        />

        <ErrorPage errorMessage={this.state.errorMessage} retry={this.reloadArticle} />;
      </div>);
    }

    if (this.state.redirectToEdit) {
      return <Redirect to={'/article/edit/' + this.state.article!.articleID} />;
    }

    if (this.state.redirectToHome) {
      return <Redirect to='/' />;
    }

    // TODO handle updated
    const { headline, author, content, published } = this.state.article!;
    const localizedTimeString = moment(published).fromNow();
    return (<div>
      <Breadcrumb
        links={[
          [this.state.article!.headline, "/article/" + this.state.article!.articleID],
        ]}
      />

      <div className="columns">
        <div className="column">
          <h1 className="title">{headline}</h1>
          <i className="fas fa-user"></i> {author.email} <i className="fas fa-clock"></i> {localizedTimeString}
          <br />
          <br />
          <div className="content">
            {ReactHTMLParser(content)}
          </div>
        </div>

        {checkIsAdmin(this.props.token) &&
          <div className="column is-narrow">
            <EditDeleteDropdown
              editClicked={this.editClicked}
              deleteClicked={this.deleteClicked}
            />
          </div>
        }

        {this.state.promptVisible &&
          <DeleteArticleConfirmationPrompt
            article={this.state.article!}
            backend={this.props.backend}
            close={this.hidePrompt}
            success={this.articleDeleted}
            token={this.props.token!}
          />
        }
      </div>
    </div>);
  }

  articleDeleted = () => {
    this.hidePrompt();
    this.setState({
      redirectToHome: true,
    });
  }

  editClicked = () => {
    if (!checkIsAdmin(this.props.token)) {
      return;
    }
    this.setState({
      redirectToEdit: true,
    });
  }

  deleteClicked = () => {
    if (!checkIsAdmin(this.props.token)) {
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

  loadArticle = async () => {
    try {
      const article = await this.props.backend.getArticle(this.getID());
      this.setState({
        article: article,
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

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
