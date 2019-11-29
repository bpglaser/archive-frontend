import React from 'react';
import { Link } from 'react-router-dom';
import ReactTable, { Column, Filter, ReactTableFunction } from 'react-table';
import { lowercaseFilterMethod } from '../Helpers';
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
        { Header: "Visibility", accessor: (project) => project.public ? "Public" : "Private", id: "public", width: 125, Filter: visibilityFilter, filterMethod: visibilityFilterMethod },
        { Header: "Owner", accessor: (project) => project.owner.username, id: "owner", width: 300 },
      ]}
      data={this.props.projects}
      defaultPageSize={10}
      filterable
      defaultFilterMethod={lowercaseFilterMethod}
    />);
  }
}

type FilterParams = { column: Column, filter: any, onChange: ReactTableFunction, key?: string };

function visibilityFilter(params: FilterParams): React.ReactElement {
  return (<div className="select" style={{ width: "100%" }}>
    <select onChange={(event) => params.onChange(event.target.value)} style={{ width: "100%" }}>
      <option>All</option>
      <option>Public</option>
      <option>Private</option>
    </select>
  </div>);
}

function visibilityFilterMethod(filter: Filter, row: any, column: any): boolean {
  switch (filter.value) {
    case 'All':
      return true;
    case 'Public':
    case 'Private':
      return row[filter.id] === filter.value;
    default:
      throw new Error('Unhandled filter branch for visibility column.');
  }
}
