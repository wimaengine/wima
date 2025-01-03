import { Vector3 } from '../../../math/index.js';
import { Shape3 } from './shape3.js'

class Line3 extends Shape3 {
  constructor(start = new Vector3(), end = new Vector3(1)) {
    this.start = start;
    this.end = end;
  }
}