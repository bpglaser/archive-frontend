import React from 'react';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';
import Loader from './Loader';
import NearbyBox from './NearbyBox';

interface Props {
  backend: Backend;
  file: File | null;
  token: string;
}

interface State {
  files: File[];
  loading: boolean;
}

export default class NearbyColumn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      files: [],
      loading: true,
    };
  }

  async componentDidMount() {
    if (this.props.file === null) {
      return;
    }

    await this.loadNearbyFiles();
    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate() {
    if (this.props.file === null) {
      return;
    }

    await this.loadNearbyFiles();
    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return (<div className="column is-narrow">
        <Loader />
      </div>);
    }

    return (<div className="column is-narrow">
      {
        this.state.files.map((file, i) => 
          <NearbyBox
            file={file}
            key={i}
          />
        )
      }
    </div>);
  }

  loadNearbyFiles = async () => {
    if (this.props.file === null) {
      return;
    }

    try {
      const files = await this.props.backend.getNearbyFiles(this.props.token, this.props.file.fileID);
      this.setState({
        files: files,
      });
    } catch (err) {
      // TODO handle properly
      console.log(err);
    }
  }
}
