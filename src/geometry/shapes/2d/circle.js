import { Shape2 } from './shape2.js'

export class Circle extends Shape2 {
  constructor(radius = 0.5) {
    super()
    this.radius = radius;
  }
}