import { Vector3 } from '../../../math/index.js';
import { Shape3 } from './shape3.js'

class Line3 extends Shape3 {
  constructor(start = new Vector3(-0.5), end = new Vector3(0.5)) {
    super()
    this.start = start;
    this.end = end;
  }
}