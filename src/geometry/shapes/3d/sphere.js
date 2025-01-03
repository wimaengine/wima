import { Shape3 } from './shape3.js'

export class Sphere extends Shape3{
  constructor(radius = 0.5) {
    this.radius = radius;
  }
}