import 'bulma';
import React from 'react';
import { Link } from 'react-router-dom';
import RecentNews from '../Components/RecentNews';
import RecentProjects from '../Components/RecentProjects';
import { Backend } from '../Data/Backend';
import { isAdmin } from '../Helpers';
import Breadcrumb from '../Components/Breadcrumb';
import PublicProjects from '../Components/PublicProjects';

interface Props {
  backend: Backend;
  token: string | null;
}

interface State {
}

export default class Primary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
  }

  render() {
    if (this.props.token === null) {
      return (<div>
        <Breadcrumb
          links={[]}
        />

        <div className="columns">
          <div className="column is-three-quarters">
            <h1 className="title">Recent News</h1>
            <RecentNews
              backend={this.props.backend}
              token={this.props.token}
            />
          </div>

          <div className="column">
            <h1 className="title">Public Projects</h1>
            <PublicProjects
              backend={this.props.backend}
            />
          </div>
        </div>
      </div>);
    }

    return (<div>
      <Breadcrumb
        links={[]}
      />

      <div className="columns">
        <div className="column is-three-quarters">
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">Recent News</h1>
              </div>
            </div>

            {isAdmin(this.props.token) &&
              <div className="level-right">
                <div className="level-item">
                  <Link to="/article/new" className="button">
                    <span className="icon">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>
                      Create New Article
                  </span>
                  </Link>
                </div>
              </div>
            }
          </nav>

          <RecentNews
            backend={this.props.backend}
            token={this.props.token}
          />
        </div>

        <div className="column">
          <h1 className="title">Your Recent Projects</h1>
          <RecentProjects
            backend={this.props.backend}
            token={this.props.token}
          />
        </div>
      </div>
    </div>);
  }
}
