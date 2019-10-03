import React from 'react';
import { Link } from 'react-router-dom';

export default class MoreProjectsCard extends React.Component {
  render() {
    return (<div className="project-preview-card">
      <div className="card">
        <div className="card-content">
          <div className="content">
            <p className="subtitle">
              View More Projects
            </p>

            <nav className="level">
              <div className="level-item">
                <Link to="/projects">
                  <span className="icon">
                    <i className="fas fa-folder-open"></i>
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>);
  }
}

