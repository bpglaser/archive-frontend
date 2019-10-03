import 'bulma';
import React from 'react';
import RecentProjects from '../Components/RecentProjects';
import { Backend } from '../Data/Backend';

interface Props {
  backend: Backend;
  token: string | null;
}

interface State {
}

export default class Primary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
  }

  render() {
    if (this.props.token === null) {
      return (<div>
        // TODO
      </div>);
    }

    return (<div>
      <h1 className="title">Your Recent Projects</h1>
      <RecentProjects
        backend={this.props.backend}
        token={this.props.token}
      />
    </div>);
  }
}
