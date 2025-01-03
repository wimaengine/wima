import { Shape3 } from './shape3.js'

export class ConvexPolyhedron extends Shape3 {
  constructor(vertices) {
    this.vertices = vertices
  }
}