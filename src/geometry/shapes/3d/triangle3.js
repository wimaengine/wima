import { Vector3 } from '../../../math/index.js';

export class Triangle3 {
  constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}
