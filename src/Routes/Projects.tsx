import * as React from "react";
import { Link } from "react-router-dom";
import { Project, generateMockProjects } from "../helpers";

type State = {
  projects: Project[],
}

const ProjectComponent: React.FC<Project> =
  ({ id, title, description, imageCount }) => (<div className="card" style={{ maxWidth: "25em", margin: "1em" }}>
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

export default class Projects extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      projects: generateMockProjects(),
    }
  }

  render() {
    return (<div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "space-evenly" }}>
      {
        this.state.projects.map((project, i) =>
          <ProjectComponent {...project} />)
      }
    </div>)
  }
}
