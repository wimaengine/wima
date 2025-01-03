import { Vector2 } from '../../../math/index.js';
import { Shape2 } from './shape2.js'

export class Triangle2 extends Shape2 {
  constructor(a = new Vector2(), b = new Vector2(), c = new Vector2()) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}