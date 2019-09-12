import * as React from 'react';

interface CheckboxProps {
  labelValue: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ labelValue }) => {
  return (<div className="field">
    <div className="control">
      <label className="checkbox">
        <input type="checkbox" style={{ marginRight: ".5em" }} />
        {labelValue}
      </label>
    </div>
  </div>)
}

export const DebugToggle: React.FC<{ fields: CheckboxProps[] }> = (props) => {
  const [toggled, setToggled] = React.useState(false);

  return (<div className="container" style={{ marginTop: "2em" }}>
    <button className={toggled ? "button is-warning" : "button"} onClick={() => setToggled(!toggled)}>
      <span className="icon">
        <i className="fas fa-code"></i>
      </span>

      <span>
        Debug Mode
      </span>
    </button>

    {toggled &&
      <div className="container">
        {
          props.fields.map((props) => <Checkbox {...props} />)
        }
      </div>
    }
  </div>)
}
