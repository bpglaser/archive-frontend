import * as React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../Models/helpers';

export default class ProjectPreviewCard extends React.Component<{ project: Project }> {
  render() {
    let { id, title, description, imageCount } = this.props.project
    return (<div className="card" style={{ maxWidth: "25em", margin: "1em" }}>
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>

      <div className="card-content">
        <div className="content">
          {description}
          <br />
          <br />
          Project size: {imageCount}
        </div>
      </div>

      <footer className="card-footer">
        <Link to={"/projects/" + id} className="card-footer-item">
          View
      </Link>
      </footer>
    </div>)
  }
}
