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
  imageDisplayUrl: string | null;
  loading: boolean;
}

export default class FileDetails extends React.Component<Props, State> {
  readonly linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      file: null,
      imageDisplayUrl: null,
      loading: true,
    };
    this.linkRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({
      errorMessage: null,
      loading: true,
    });

    await this.loadFileDetails();
    await this.downloadDisplayImage();

    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      await this.componentDidMount();
    }
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-has-content */
    /* eslint-disable jsx-a11y/anchor-is-valid */
    if (this.state.errorMessage !== null) {
      return <ErrorPage
        errorMessage={this.state.errorMessage}
        retry={this.componentDidMount}
      />
    }

    if (this.state.loading) {
      return <Loader />;
    }

    return (<div>
      <div className="columns">
        <div className="column">
          <button className="button" onClick={this.downloadClicked}>Download</button>

          {this.state.imageDisplayUrl &&
            <img src={this.state.imageDisplayUrl} alt="preview" />
          }

          {this.state.file &&
            <Comments
              backend={this.props.backend}
              file={this.state.file}
              token={this.props.token}
            />
          }
        </div>

        <NearbyColumn
          backend={this.props.backend}
          file={this.state.file}
          token={this.props.token!}
        />
      </div>

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

  downloadClicked = async () => {
    try {
      const blob = await this.props.backend.downloadFile(this.props.token, this.getID());
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

  downloadDisplayImage = async () => {
    try {
      const blob = await this.props.backend.downloadFile(this.props.token, this.getID(), 'png');
      const url = window.URL.createObjectURL(blob);
      this.setState({
        imageDisplayUrl: url,
      });
    } catch (err) {
      console.log(err);
      this.props.displayError('Error encountered while loading display image.');
    }
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
