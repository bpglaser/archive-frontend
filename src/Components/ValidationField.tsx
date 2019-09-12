import * as React from 'react';

interface Props {
  disabled: boolean,
  innerInputRef: React.RefObject<HTMLInputElement>,
  inputPlaceholder: string,
  inputType: string,
  invalid: boolean,
  invalidMessage: string,
  leftIconName: string,
  rightIconName: string,
}

export default class ValidationField extends React.Component<Props> {
  render() {
    return (<div className="field">
      <p className={this.props.invalid ? "control has-icons-left has-icons-right" : "control has-icons-left"}>
        <input
          className={this.props.invalid ? "input is-danger" : "input"}
          type={this.props.inputType}
          placeholder={this.props.inputPlaceholder}
          disabled={this.props.disabled}
          ref={this.props.innerInputRef} />

        <span className="icon is-small is-left">
          <i className={"fas " + this.props.leftIconName}></i>
        </span>

        {this.props.invalid &&
          <span className="icon is-small is-right">
            <i className={"fas " + this.props.rightIconName}></i>
          </span>
        }
      </p>

      {this.props.invalid &&
        <p className="help is-danger">{this.props.invalidMessage}</p>
      }
    </div>)
  }
}
