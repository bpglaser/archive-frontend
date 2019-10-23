import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  links: string[][];
}

interface State {

}

export default class Breadcrumb extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const links = [["Home", "/"], ...this.props.links];

    const lastEntry =
      links.length > 0
        ? links[links.length - 1]
        : null;

    return (<nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
        {
          links.slice(0, links.length - 1).map(([name, link]) => {
            return <li><Link to={link}>{name}</Link></li>
          })
        }
        {lastEntry &&
          <li className="is-active"><Link to={lastEntry[1]}>{lastEntry[0]}</Link></li>
        }
      </ul>
    </nav>);
  }
}
