import { Shape3 } from './shape3.js'

export class Trimesh extends Shape3 {
  constructor(vertices, indices) {
    super()
    this.vertices = vertices
    this.indices = indices
    this.normals = []
  }
}