import React from 'react';

export default class NotFound extends React.Component {
  render() {
    return (<div className="has-text-centered" style={{ marginTop: "5em" }}>
        <h1 className="title">404</h1>
        <h2 className="subtitle">Page not found!</h2>
    </div>);
  }
}
