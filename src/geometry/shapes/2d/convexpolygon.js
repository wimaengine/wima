import { Shape2 } from './shape2.js'

export class ConvexPolygon extends Shape2 {
  constructor(vertices) {
    super()
    this.vertices = vertices
  }
}