import React from 'react';

interface Props {
  isPublic: boolean;
  toggle: () => void;
}

interface State {
}

export default class PublicToggleButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<div className="buttons has-addons">
      <button
        className={getButtonClassName(this.props.isPublic)}
        disabled={this.props.isPublic}
        onClick={this.props.toggle}
      >
        Public
      </button>
      <button
        className={getButtonClassName(!this.props.isPublic)}
        disabled={!this.props.isPublic}
        onClick={this.props.toggle}
      >
        Private
      </button>
    </div>);
  }
}

function getButtonClassName(selected: boolean) {
  return selected ? "button is-danger is-selected" : "button";
}
