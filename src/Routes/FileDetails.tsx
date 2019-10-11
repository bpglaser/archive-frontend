import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import Comments from '../Components/Comments';
import NearbyColumn from '../Components/NearbyColumn';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  token: string | null;
}

interface State {
  file: File | null,
  loading: boolean;
  redirect: string | null;
}

export default class FileDetails extends React.Component<Props, State> {
  readonly linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      file: null,
      loading: true,
      redirect: this.props.token ? null : '/',
    };
    this.linkRef = React.createRef();
  }

  async componentDidMount() {
    if (this.props.token) {
      await this.loadFileDetails();
      this.setState({
        loading: false,
      });
    }
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.token !== oldProps.token) {
      this.setState({
        redirect: this.props.token ? this.state.redirect : '/',
      });

      if (this.props.token) {
        this.setState({
          loading: true,
        });
        await this.loadFileDetails();
        this.setState({
          loading: false,
        });
      }
    }
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-has-content */
    /* eslint-disable jsx-a11y/anchor-is-valid */
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
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
      // TODO handle errors properly
      console.log(err);
    }
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
      // TODO handle
      console.log(err);
    }
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
