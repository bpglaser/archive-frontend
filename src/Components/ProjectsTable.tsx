import React from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { Project } from '../Models/Project';

interface Props {
  projects: Project[];
}

interface State {
}

export default class ProjectsTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<ReactTable
      columns={[
        { Header: "Name", accessor: "name", Cell: props => <Link to={"/projects/" + props.original.projectID}>{props.value}</Link> },
        { Header: "Files", accessor: "fileCount", width: 75 },
        { Header: "Visibility", accessor: (project) => project.public ? "Public" : "Private", id: "public", width: 75 },
        { Header: "Owner", accessor: (project) => project.owner.username, id: "owner", width: 300 },
      ]}
      data={this.props.projects}
      defaultPageSize={10}
    />);
  }
}
