import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../Models/Project';

export default class ProjectPreviewCard extends React.Component<{ project: Project }> {
  render() {
    const { projectID, name, description } = this.props.project;

    return (<div className="project-preview-card">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">{name}</p>
        </header>

        <div className="card-content">
          <div className="content">
            {description}
            <br />
            <br />
            Project size: ?
          </div>
        </div>

        <footer className="card-footer">
          <Link to={"/projects/" + projectID} className="card-footer-item">
            View
          </Link>
        </footer>

      </div>
    </div>);
  }
}
