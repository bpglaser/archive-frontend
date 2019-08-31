import React from "react";
import { RouteComponentProps } from "react-router";

type Params = {
  id: string, 
}

export default class ProjectDetails extends React.Component<RouteComponentProps<Params>> {
  render() {
    let params = this.props.match.params
    return (<div>
      {params.id}
    </div>)
  }
}
