import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Backend } from '../Data/Backend';
import { Article } from '../Models/Article';
import Loader from '../Components/Loader';
import moment from 'moment';

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
}

interface State {
  article: Article | null;
  errorMessage: string | null;
  loading: boolean;
}

export default class ArticleDetails extends React.Component<Props, State> {
  readonly id: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      article: null,
      errorMessage: null,
      loading: true,
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
      // TODO proper error
      return <div>{this.state.errorMessage}</div>;
    }

    // TODO handle updated
    const { headline, author, content, published } = this.state.article!;
    const localizedTimeString = moment(published).fromNow();
    return (<div>
      <h1 className="title">{headline}</h1>
      <i className="fas fa-user"></i> {author.email} <i className="fas fa-clock"></i> {localizedTimeString}
      <br />
      <br />
      {content}
    </div>);
  }

  loadArticle = async () => {
    try {
      const article = await this.props.backend.getArticle(this.id);
      this.setState({
        article: article,
      });
    } catch (err) {
      // TODO fine tune error handling
      this.setState({
        errorMessage: 'Failed to load article',
      });
    }
  }
}
