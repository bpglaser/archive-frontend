import React from 'react';

interface Props {
  errorMessage: string;
  retry: () => void;
}

export default class ErrorPage extends React.Component<Props> {
  render() {
    return (<div className="columns is-centered">
      <div className="column is-narrow has-text-centered is-full-mobile is-full-tablet is-half-desktop is-half-widescreen is-half-fullhd">
        <span className="icon is-large has-text-warning">
          <i className="fas fa-3x fa-exclamation-triangle"></i>
        </span>
        <h4 className="title is-4">
          {this.props.errorMessage}
        </h4>
        <button className="button">
          <span className="icon">
            <i className="fas fa-redo"></i>
          </span>
        </button>
      </div>
    </div>);
  }
}
