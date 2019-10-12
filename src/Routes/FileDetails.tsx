import React from 'react';
import { RouteComponentProps } from 'react-router';
import Comments from '../Components/Comments';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import NearbyColumn from '../Components/NearbyColumn';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  displayError: (s: string) => void;
  token: string;
}

interface State {
  errorMessage: string | null;
  file: File | null,
  loading: boolean;
}

export default class FileDetails extends React.Component<Props, State> {
  readonly linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      file: null,
      loading: true,
    };
    this.linkRef = React.createRef();
  }

  async componentDidMount() {
    await this.loadFileDetails();
    this.setState({
      loading: false,
    });
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-has-content */
    /* eslint-disable jsx-a11y/anchor-is-valid */
    if (this.state.errorMessage !== null) {
      return <ErrorPage
        errorMessage={this.state.errorMessage}
        retry={this.reloadFileDetails}
      />
    }

    if (this.state.loading) {
      return <Loader />;
    }

    return (<div>
      <div className="columns">
        <div className="column">
          hello world
          <button className="button" onClick={this.downloadClicked}>Download</button>
        </div>

        <NearbyColumn
          backend={this.props.backend}
          file={this.state.file}
          token={this.props.token!}
        />
      </div>

      {this.state.file && this.props.token &&
        <Comments
          backend={this.props.backend}
          file={this.state.file}
          token={this.props.token}
        />
      }

      <a style={{ display: 'none' }} ref={this.linkRef}></a>
    </div>);
    /* eslint-enable jsx-a11y/anchor-has-content */
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }

  loadFileDetails = async () => {
    try {
      const file = await this.props.backend.getFileDetails(this.props.token!, this.getID());
      this.setState({
        file: file,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Error loading file details.',
      });
    }
  }

  reloadFileDetails = async () => {
    this.setState({
      loading: true,
    });

    await this.loadFileDetails();

    this.setState({
      loading: false,
    });
  }

  downloadClicked = async () => {
    try {
      const blob = await this.props.backend.downloadFile(this.props.token!, this.getID());
      const url = window.URL.createObjectURL(blob);
      this.linkRef.current!.href = url;
      this.linkRef.current!.download = this.state.file!.name;
      this.linkRef.current!.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      this.props.displayError('Error encountered while downloading file.');
    }
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
