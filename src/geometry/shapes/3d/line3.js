import { Vector3 } from '../../../math/index.js';

class Line3 {
  constructor(start = new Vector3(), end = new Vector3(1)) {
    this.start = start;
    this.end = end;
  }
}