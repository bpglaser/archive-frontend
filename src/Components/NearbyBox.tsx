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
    const { distance, file } = this.props;
    const degrees = Math.floor(distance);
    const minutes = Math.floor((distance - degrees) * 60);
    const seconds = Math.floor((distance - degrees - minutes / 60) * 3600);

    return (<div className="card">
      <header className="card-header">
        <p className="card-header-title">
          {file.name}
        </p>
      </header>

      <div className="card-content">
        <div className="content">
          <p className="has-text-centered">
            Distance: {degrees}&#176; {minutes}' {seconds}"
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
