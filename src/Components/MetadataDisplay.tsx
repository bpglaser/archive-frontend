import React from 'react';
import ReactTable, { Filter } from 'react-table';

interface Props {
  metadata: { [key: string]: string };
}

interface State {

}

export default class MetadataDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const rows = [];
    for (const key in this.props.metadata) {
      const value = this.props.metadata[key];
      rows.push({ key: key, value: value });
    }

    return (<ReactTable
      columns={[{ Header: "Key", accessor: "key" }, { Header: "Value", accessor: "value" }]}
      data={rows}
      defaultPageSize={10}
      defaultFilterMethod={lowercaseFilterMethod}
      filterable
      sortable
    />);
  }
}

function lowercaseFilterMethod(filter: Filter, row: any, column: any) {
  return row[filter.id].toString().toLowerCase().includes(filter.value.toString().toLowerCase());
}

