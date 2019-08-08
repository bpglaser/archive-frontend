import React from 'react'

export default class Pager extends React.Component {
  render() {
    return (<div className="pager">
      <button>&#171;</button>
      <button>&#8249;</button>
      <div style={{display: "inline"}}>
        1 / 10
      </div>
      <button>&#8250;</button>
      <button>&#187;</button>
    </div>)
  }
}
