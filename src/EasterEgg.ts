export default class EasterEgg {
  readonly doEasterEgg: () => void;
  readonly map: Map<string, number>;
  state: number = 0;

  constructor(doEasterEgg: () => void) {
    this.doEasterEgg = doEasterEgg;
    this.map = new Map([
      ['ArrowUp 0', 1],
      ['ArrowUp 1', 2],
      ['ArrowDown 2', 3],
      ['ArrowDown 3', 4],
      ['ArrowLeft 4', 5],
      ['ArrowRight 5', 6],
      ['ArrowLeft 6', 7],
      ['ArrowRight 7', 8],
      ['KeyB 8', 9],
      ['KeyA 9', 10],
      ['Enter 10', 11],
    ]);
  }

  handleKeyEvent = (event: KeyboardEvent) => {
    const nextState = this.map.get(event.code + ' ' + this.state);
    if (nextState) {
      this.state = nextState;
    } else {
      this.state = 0;
    }

    if (this.state === 11) {
      this.state = 0;
      this.doEasterEgg();
    }
  }
}