import React from "react";
import './TabSwitcher.css';

type TabProps = {
  name: string,
  idx: number,
  selected: boolean,
  selectedCallback: (i: number) => void,
}

class Tab extends React.Component<TabProps> {
  render() {
    let classname = this.props.selected ? "tab tab-selected" : "tab"
    return (<div className={classname}>
      <button onClick={() => this.props.selectedCallback(this.props.idx)}>
        <h2>{this.props.name}</h2>
      </button>
    </div>)
  }
}

type TabSwitcherProps = {
  tabNames: string[],
  selected: number,
  selectedCallback: (i: number) => void,
}

class TabSwitcher extends React.Component<TabSwitcherProps> {
  render() {
    return (<div className="tab-switcher">
      {
        this.props.tabNames.map((name, i) =>
          <Tab key={i} name={name} idx={i} selected={this.props.selected === i}
            selectedCallback={this.props.selectedCallback}/>
        )
      }
    </div>)
  }
}

export default TabSwitcher
