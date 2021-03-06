import * as React from 'react';

interface Props {
  disabled: boolean;
  innerInputRef?: React.RefObject<HTMLInputElement>;
  label: string;
  inputType: string;
  invalid: boolean;
  invalidMessage: string;
  leftIconName: string;
  submit: () => void;
  rightIconName: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
}

export default class ValidationField extends React.Component<Props> {
  render() {
    return (<div className="field">
      <label className="label">{this.props.label}</label>

      <p className={this.props.invalid ? "control has-icons-left has-icons-right" : "control has-icons-left"}>
        <input
          className={this.props.invalid ? "input is-danger" : "input"}
          type={this.props.inputType}
          placeholder={this.props.label}
          disabled={this.props.disabled}
          onChange={this.props.onChange}
          onKeyUp={this.inputOnKeyUp}
          ref={this.props.innerInputRef}
          value={this.props.value}
        />

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

      {this.props.children}
    </div>);
  }

  inputOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enterKeyCode = 13;
    if (event.keyCode === enterKeyCode) {
      this.props.submit();
    }
  }
}
