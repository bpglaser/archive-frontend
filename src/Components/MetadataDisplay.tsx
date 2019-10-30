import React from 'react';
import ReactTable from 'react-table';

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
      columns={[{ accessor: 'key' }, { accessor: 'value' }]}
      data={rows}
      defaultPageSize={10}
      filterable
    />);
  }
}

