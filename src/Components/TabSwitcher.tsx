import React from "react";

type TabProps = {
  name: string,
  idx: number,
  selected: boolean,
  selectedCallback: (i: number) => void,
}

class Tab extends React.Component<TabProps> {
  render() {
    let classname = this.props.selected ? "is-active" : ""
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (<li className={classname}>
      <a onClick={() => this.props.selectedCallback(this.props.idx)}>
        {this.props.name}
      </a>
    </li>)
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}

type TabSwitcherProps = {
  tabNames: string[],
  selected: number,
  selectedCallback: (i: number) => void,
}

class TabSwitcher extends React.Component<TabSwitcherProps> {
  render() {
    return (<div className="tabs is-boxed">
      <ul>
        {
          this.props.tabNames.map((name, i) =>
            <Tab key={i} name={name} idx={i} selected={this.props.selected === i}
              selectedCallback={this.props.selectedCallback} />
          )
        }
      </ul>
    </div>)
  }
}

export default TabSwitcher
