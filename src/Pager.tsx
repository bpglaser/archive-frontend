import React from 'react'

type Props = {
  max: number
  selected: number
}

class Pager extends React.Component<Props> {
  render() {
    let isSinglePage = this.props.max === 1
    let previousDisabled = this.props.selected === 1 || isSinglePage
    let nextDisabled = this.props.selected === this.props.max || isSinglePage
    return (<nav className="pagination is-centered" role="navigation">
      <button className="pagination-previous" disabled={previousDisabled}>
        Previous
      </button>
      <button className="pagination-next" disabled={nextDisabled}>
        Next
      </button>
      {this.props.max < 7 &&
        <ul className="pagination-list">
          {
            Array.from({length: this.props.max}, (x , i) => i + 1).map((key) =>
              <li><button className={this.getActiveClassName(key)} key={key}>{key}</button></li>)
          }
        </ul>
      }
      {this.props.max >= 7 &&
        <ul className="pagination-list">
          <li><button className="pagination-link">1</button></li>
          <li><span className="pagination-ellipsis">&hellip;</span></li>
          <li><button className="pagination-link">{this.props.selected - 1}</button></li>
          <li><button className="pagination-link is-current">{this.props.selected}</button></li>
          <li><button className="pagination-link">{this.props.selected + 1}</button></li>
          <li><span className="pagination-ellipsis">&hellip;</span></li>
          <li><button className="pagination-link">{this.props.max}</button></li>
        </ul>
      }
    </nav>)
  }

  getActiveClassName = (key: number): string => {
    if (this.props.selected === key) {
      return "pagination-link is-current"
    } else {
      return "pagination-link"
    }
  }
}

export default Pager
