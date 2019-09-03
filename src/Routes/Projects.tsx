import * as React from "react";
import { Project, generateMockProjects } from "../Models/helpers";
import ProjectPreviewCard from "../Components/ProjectPreviewCard";

interface State {
  projects: Project[];
}

export default class Projects extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      projects: generateMockProjects(),
    }
  }

  render() {
    return (<div className="projects">
      {
        this.state.projects.map((project, i) =>
          <ProjectPreviewCard project={project} />)
      }
    </div>)
  }
}
