import React from "react";
import { RouteComponentProps } from "react-router";
import UploadPrompt from "../Components/Prompts/UploadPrompt";

interface Params {
  id: string;
}

interface State {
  uploadPromptVisible: boolean;
}

export default class ProjectDetails extends React.Component<RouteComponentProps<Params>, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      uploadPromptVisible: false,
    }
  }

  render() {
    let params = this.props.match.params
    return (<div>
      {params.id}
      <br></br>
      <button className="button" onClick={this.showUploadPrompt}>Upload</button>

      {this.state.uploadPromptVisible &&
        <UploadPrompt close={this.closeUploadPrompt} closeWithSuccess={this.closeUploadPrompt} />
      }
    </div>)
  }

  showUploadPrompt = () => {
    this.setState({
      uploadPromptVisible: true
    })
  }

  closeUploadPrompt = () => {
    this.setState({
      uploadPromptVisible: false
    })
  }
}
