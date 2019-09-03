import * as React from "react";
import { Project, generateMockProjects } from "../Models/helpers";
import ProjectPreviewCard from "../Components/ProjectPreviewCard";
import { delay } from "q";

interface State {
  awaitingCreationResponse: boolean;
  createNewProjectPromptVisible: boolean;
  projects: Project[];
}

export default class Projects extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      awaitingCreationResponse: false,
      createNewProjectPromptVisible: false,
      projects: generateMockProjects(),
    }
  }

  render() {
    return (<div>
      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            <button className="button" onClick={this.displayNewProjectDialog}>
              <span className="icon">
                <i className="fas fa-plus"></i>
              </span>
              <span>
                Create New Project
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="projects">
        {
          this.state.projects.map((project, i) =>
            <ProjectPreviewCard project={project} />)
        }
      </div>

      {this.state.createNewProjectPromptVisible &&
        <div className="modal is-active">
          <div className="modal-background" onClick={this.cancelCreateProject}></div>

          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Create New Project</p>
              <button className="delete" aria-label="close" onClick={this.cancelCreateProject}></button>
            </header>

            <section className="modal-card-body">
              <div className="field">
                <label className="label">Project Name</label>
                <div className="control">
                  <input className="input" type="text" placeholder="Project Name" />
                </div>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea className="textarea" placeholder="Description" />
                </div>
              </div>
            </section>

            <footer className="modal-card-foot">
              <button
                className={this.state.awaitingCreationResponse ? "button is-success is-loading" : "button is-success"}
                disabled={this.state.awaitingCreationResponse}
                onClick={this.submitNewProject}>
                Create
              </button>
              <button className="button" onClick={this.cancelCreateProject}>Cancel</button>
            </footer>
          </div>
        </div>
      }
    </div>)
  }

  cancelCreateProject = () => {
    this.setState({
      createNewProjectPromptVisible: false,
    })
  }

  displayNewProjectDialog = () => {
    this.setState({
      createNewProjectPromptVisible: true,
    })
  }

  submitNewProject = async () => {
    this.setState({
      awaitingCreationResponse: true,
    })

    await delay(1000)

    this.setState({
      awaitingCreationResponse: false,
      createNewProjectPromptVisible: false,
    })
  }
}
