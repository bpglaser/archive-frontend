import React from 'react';
import { Backend } from '../Data/Backend';
import { RouteComponentProps } from 'react-router';
import { File } from '../Models/File';
import Comments from '../Components/Comments';
import NearbyColumn from '../Components/NearbyColumn';

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  token: string | null;
}

interface State {
  file: File | null,
  loading: boolean;
}

export default class FileDetails extends React.Component<Props, State> {
  readonly id: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      file: null,
      loading: true,
    };
    this.id = Number(this.props.match.params.id);
  }

  async componentDidMount() {
    // TODO handle null token
    await this.loadFileDetails();
    this.setState({
      loading: false,
    });
  }

  render() {
    return (<div>
      <div className="columns">
        <div className="column">
          hello world
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
    </div>);
  }

  loadFileDetails = async () => {
    try {
      const file = await this.props.backend.getFileDetails(this.props.token!, this.id);
      this.setState({
        file: file,
      });
    } catch (err) {
      // TODO handle errors properly
      console.log(err);
    }
  }
}
