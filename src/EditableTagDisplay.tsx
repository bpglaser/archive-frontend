import React from "react"
import Tag from "./Tag"

type Props = {
  deletedCallback?: (i: number) => void,
  tags: string[],
}

class EditableTagDisplay extends React.Component<Props> {
  render() {
    return (<div className="editable-tag-display">
      {
        this.props.tags.map((tag, i) => {
          <Tag content={tag} deleteCallback={this.props.deletedCallback} idx={i}/>
        })
      }
    </div>)
  }
}

export default EditableTagDisplay
