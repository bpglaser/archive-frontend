import React from 'react';
import { ZXCVBNResult } from 'zxcvbn';

interface Props {
  passwordStrength: ZXCVBNResult | null;
}

export default class StrengthIndicator extends React.Component<Props> {
  render() {
    const score = this.props.passwordStrength ? this.props.passwordStrength.score + 1 : 0;
    return (<div className="field">
      <progress className={getProgressClassName(score)} value={score} max="5">{score}</progress>
    </div>);
  }
}

function getProgressClassName(score: number): string {
  switch (score) {
    case 1:
      return "progress is-danger";
    case 2:
      return "progress is-danger";
    case 3:
      return "progress is-warning";
    case 4:
      return "progress is-success";
    case 5:
      return "progress is-success";
    default:
      return "progress";
  }
}
