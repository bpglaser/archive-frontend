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

    return (<div className="card">
      <header className="card-header">
        <p className="card-header-title">
          {file.name}
        </p>
      </header>

      <div className="card-content">
        <div className="content">
          <figure className="image is-128x128">
            <Link to={'/file/' + file.fileID}>
              <img src="https://picsum.photos/128" alt="placeholder" />
            </Link>
          </figure>
          <p className="has-text-centered">
            Distance: 5&#176;10'45"
          </p>
        </div>
      </div>
    </div>);
  }
}
