import React from 'react';
import { Backend } from '../Data/Backend';
import { Article } from '../Models/Article';
import ArticleBox from './ArticleBox';
import Loader from './Loader';
import { createErrorMessage } from '../Helpers';

interface Props {
  backend: Backend;
  token: string | null;
}

interface State {
  articles: Article[];
  errorMessage: string | null;
  loading: boolean;
}

export default class RecentNews extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      articles: [],
      errorMessage: null,
      loading: true,
    };
  }

  async componentDidMount() {
    await this.loadNews();
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
        {this.state.errorMessage}
      </div>);
    }

    if (this.state.articles.length === 0) {
      return (<div>
        No recent news!
      </div>);
    }

    return (<div>
      {
        this.state.articles.map((article, i) =>
          <ArticleBox
            article={article}
            articleDeleted={this.articleDeleted}
            backend={this.props.backend}
            key={i}
            token={this.props.token}
          />)
      }
    </div>);
  }

  articleDeleted = async () => {
    await this.loadNews();
  }

  loadNews = async () => {
    try {
      const articles = await this.props.backend.getArticles();
      this.setState({
        articles: articles,
      });
    } catch (err) {
      this.setState({
        errorMessage: createErrorMessage(err, 'Failed to load news!'),
      });
    }
  }
}
