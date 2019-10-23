import 'bulma';
import React from 'react';
import RecentNews from '../Components/RecentNews';
import RecentProjects from '../Components/RecentProjects';
import { Backend } from '../Data/Backend';
import { readTokenPayload } from '../Helpers';
import { Link } from 'react-router-dom';

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
        <h1 className="title">Recent News</h1>
        <RecentNews
          backend={this.props.backend}
          token={this.props.token}
        />
      </div>);
    }

    return (<div className="columns">
      <div className="column is-three-quarters">
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title">Recent News</h1>
            </div>
          </div>

          {this.isAdmin() &&
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
    </div>);
  }

  isAdmin = () => {
    if (!this.props.token) {
      return false;
    }

    const user = readTokenPayload(this.props.token);

    if (user.admin === undefined) {
      return false;
    } else {
      return user.admin;
    }
  }
}
