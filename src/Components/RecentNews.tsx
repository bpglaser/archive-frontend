import React from 'react';
import { Backend } from '../Data/Backend';
import { Article } from '../Models/Article';
import Loader from './Loader';
import ArticleBox from './ArticleBox';

interface Props {
  backend: Backend;
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
        this.state.articles.map((article, i) => <ArticleBox article={article} key={i} />)
      }
    </div>);
  }

  loadNews = async () => {
    try {
      const articles = await this.props.backend.getArticles();
      this.setState({
        articles: articles,
      });
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to load news!',
      });
    }
  }
}
