import React from 'react';
import { Link } from 'react-router-dom';
import { File } from '../Models/File';

interface Props {
  distance: number;
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

    return (<div className="card">
      <header className="card-header">
        <p className="card-header-title">
          {file.name}
        </p>
      </header>

      <div className="card-content">
        <div className="content">
          <p className="has-text-centered">
            Distance: {this.props.distance}&#176;
          </p>
          <p className="has-text-centered">
            <Link to={'/file/' + file.fileID}>
              View
            </Link>
          </p>
        </div>
      </div>
    </div>);
  }
}
