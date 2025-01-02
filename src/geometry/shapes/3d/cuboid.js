import { Vector3 } from '../../../math/index.js'

export class Cuboid {
  constructor(
    x = 0.5,
    y = 0.5,
    z = 0.5
    ) {
    this.extents = new Vector3(x,y,z)
  }
}