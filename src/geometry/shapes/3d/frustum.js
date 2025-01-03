import { Vector3 } from '../../../math/index.js';
import { Sphere } from './Sphere.js';
import { Plane } from './plane.js';
import { Shape3 } from './shape3.js'

export class Frustum extends Shape3 {
  constructor(p0 = new Plane(), p1 = new Plane(), p2 = new Plane(), p3 = new Plane(), p4 = new Plane(), p5 = new Plane()) {

    this.planes = [p0, p1, p2, p3, p4, p5];
  }
}