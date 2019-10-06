import React from 'react';
import { File } from '../Models/File';

interface Props {
  file: File;
}

interface State {

}

export default class NearbyBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (<div>
      {this.props.file.fileID}
    </div>);
  }
}
