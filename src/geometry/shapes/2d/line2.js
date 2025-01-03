import { Vector2, clamp } from '../../../math/index.js';
import { Shape2 } from './shape2.js'

export class Line2 extends Shape2 {
  constructor(start = new Vector2(), end = new Vector2(1)) {
    super()
    this.start = start;
    this.end = end;
  }
}