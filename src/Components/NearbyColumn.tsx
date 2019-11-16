import React from 'react';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';
import ErrorPage from './ErrorPage';
import Loader from './Loader';
import NearbyBox from './NearbyBox';
import { createErrorMessage } from '../Helpers';

interface Props {
  backend: Backend;
  file: File | null;
  token: string;
}

interface State {
  errorMessage: string | null;
  nearby: { distance: number, file: File }[];
  loading: boolean;
}

export default class NearbyColumn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      nearby: [],
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

  async componentDidUpdate(prevProps: Props) {
    if (this.props.file === prevProps.file || this.props.file === null) {
      return;
    }

    await this.loadNearbyFiles();
    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.errorMessage) {
      return <ErrorPage
        errorMessage={this.state.errorMessage}
        retry={this.reloadNearbyFiles}
      />
    }

    if (this.state.loading) {
      return (<div className="column is-narrow">
        <Loader />
      </div>);
    }

    return (<div className="column is-narrow">
      <h1 className="title">What's Nearby</h1>
      {
        this.state.nearby.map(({ distance, file }, i) =>
          <NearbyBox
            distance={distance}
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
      const nearby = await this.props.backend.getNearbyFiles(this.props.token, this.props.file.fileID);
      this.setState({
        nearby: nearby,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: createErrorMessage(err, 'Error loading nearby files.'),
      });
    }
  }

  reloadNearbyFiles = async () => {
    this.setState({
      loading: true,
    });

    await this.loadNearbyFiles();

    this.setState({
      loading: false,
    });
  }
}
