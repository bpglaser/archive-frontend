import React from 'react';
import { Link } from 'react-router-dom';
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
    const file = this.props.file;

    return (<div>
      <Link to={'/file/' + file.fileID} >{file.name}</Link>
    </div>);
  }
}
