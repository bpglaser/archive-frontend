import React from "react"
import "./Tag.css"

type Props = {
  content: string,
  deleteCallback?: (idx: number) => void,
  idx: number,
}

class Tag extends React.Component<Props> {
  render() {
    return (<div className="tag">
      <div className="tag-left">&nbsp;</div>
      <div className="tag-content">
        {this.props.content}
      </div>
      {this.props.deleteCallback != null &&
        <div>
          <button className="delete-button" onClick={this.deleteClicked}>
            <svg width="1em" height="1em">
              <circle id="circle_1" r="0.5em" cy="0.5em" cx="0.5em" fill="#ff0000"/>
              <line id="cross_1" x1="0.25em" y1="0.25em" x2="0.75em" y2="0.75em" strokeWidth="2" stroke="#000000"/>
              <line id="cross_2" x1="0.75em" y1="0.25em" x2="0.25em" y2="0.75em" strokeWidth="2" stroke="#000000"/>
            </svg>
          </button>
        </div>
      }
    </div>)
  }

  deleteClicked = () => {
    if (this.props.deleteCallback) {
      this.props.deleteCallback(this.props.idx)
    }
  }
}

export default Tag
