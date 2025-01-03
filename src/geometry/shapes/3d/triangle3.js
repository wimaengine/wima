import { Vector3 } from '../../../math/index.js';
import { Shape3 } from './shape3.js'

export class Triangle3 extends Shape3{
  constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
    super()
    this.a = a;
    this.b = b;
    this.c = c;
  }
}
