import React from 'react'

type Props = {
  max: number
  nextButtonClicked: (event: React.MouseEvent<HTMLButtonElement>) => void,
  numberButtonClicked: (n: number) => void,
  previousButtonClicked: (event: React.MouseEvent<HTMLButtonElement>) => void,
  selected: number
}

export default class Pager extends React.Component<Props> {
  render() {
    let isSinglePage = this.props.max === 1
    let previousDisabled = this.props.selected === 1 || isSinglePage
    let nextDisabled = this.props.selected === this.props.max || isSinglePage

    return (<nav className="pagination is-centered" role="navigation">
      <button
        className="pagination-previous"
        disabled={previousDisabled}
        onClick={this.props.previousButtonClicked}>
        Previous
      </button>

      <button
        className="pagination-next"
        disabled={nextDisabled}
        onClick={this.props.nextButtonClicked}>
        Next
      </button>

      {this.props.max < 7 &&
        <ul className="pagination-list">
          {
            Array.from({ length: this.props.max }, (x, i) => i + 1).map((key) =>
              <li><button className={this.getActiveClassName(key)} key={key} onClick={() => this.props.numberButtonClicked(key)}>{key}</button></li>)
          }
        </ul>
      }

      {this.props.max >= 7 &&
        <ul className="pagination-list">
          <li>
            <button
              className={this.getHiddenClassNameLeft(this.getActiveClassName(1))}
              onClick={() => this.props.numberButtonClicked(1)}>
              1
            </button>
          </li>

          <li>
            <span className={this.getHiddenClassNameLeft("pagination-ellipsis")}>
              &hellip;
            </span>
          </li>

          {
            this.generateIndices().map((n) =>
              <li>
                <button
                  className={this.getActiveClassName(n)}
                  onClick={() => this.props.numberButtonClicked(n)}>
                  {n}
                </button>
              </li>)
          }

          <li>
            <span className={this.getHiddenClassNameRight("pagination-ellipsis")}>
              &hellip;
            </span>
          </li>

          <li>
            <button
              className={this.getHiddenClassNameRight(this.getActiveClassName(this.props.max))}
              onClick={() => this.props.numberButtonClicked(this.props.max)}>
              {this.props.max}
            </button>
          </li>
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

  getHiddenClassNameLeft = (s: string): string => {
    if (this.props.selected <= 2) {
      return s + " hidden"
    } else {
      return s
    }
  }

  getHiddenClassNameRight = (s: string): string => {
    if (this.props.selected >= this.props.max - 2) {
      return s + " hidden"
    } else {
      return s
    }
  }

  generateIndices = () => {
    const n = this.props.selected
    const max = this.props.max
    if (n <= 2) {
      return [1, 2, 3, 4, 5]
    } else if (n >= max - 2) {
      return [max - 4, max - 3, max - 2, max - 1, max]
    } else {
      return [n - 2, n - 1, n, n + 1, n + 2]
    }
  }
}
