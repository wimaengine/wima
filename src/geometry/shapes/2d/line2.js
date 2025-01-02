import { Vector2, clamp } from '../../../math/index.js';

export class Line2 {
  constructor(start = new Vector2(), end = new Vector2(1)) {
    this.start = start;
    this.end = end;
  }
}