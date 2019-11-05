import Axios, { CancelTokenSource } from 'axios';
import React from 'react';

type Suggestions = { suggestion: string, select: () => void }[];

interface Props {
  suggestionProvider: (source: CancelTokenSource, search: string) => Suggestions | Promise<Suggestions>;
}

interface State {
  cancelToken: CancelTokenSource | null;
  loading: boolean;
  search: string;
  suggestions: Suggestions;
}

export default class MagicSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      cancelToken: null,
      loading: false,
      search: '',
      suggestions: [],
    };
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (<div className="dropdown is-active">
      <div className="dropdown-trigger">
        <div className="field">
          <div className={this.state.loading ? "control is-loading has-icons-right" : "control has-icons-right"}>
            <input
              className="input"
              onChange={this.searchInputOnChange}
              placeholder="Search"
              value={this.state.search}
            />

            {!this.state.loading &&
              <span className="icon is-right">
                <i className="fas fa-search" />
              </span>
            }
          </div>
        </div>
      </div>

      <div className="dropdown-menu" style={{ zIndex: 100 }}>
        {
          this.state.suggestions.map(({ suggestion, select }, i) =>
            <div className="dropdown-content" key={i}>
              <a className="dropdown-item" onClick={select}>{suggestion}</a>
            </div>
          )
        }
      </div>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }

  searchInputOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.cancelToken) {
      this.state.cancelToken.cancel('New input');
    }

    const search = event.target.value;
    this.setState({
      loading: true,
      search: search,
      suggestions: [],
    });

    try {
      const cancelTokenSource = Axios.CancelToken.source();
      this.setState({
        cancelToken: cancelTokenSource,
      });

      const suggestions = await this.props.suggestionProvider(cancelTokenSource, search);
      this.setState({
        loading: false,
        suggestions: suggestions,
      });
    } catch (err) {
      if (!Axios.isCancel(err)) {
        throw err;
      }
    }
  }
}
