
export class ShapeContainer {
  shape
  constructor(shape){
    this.shape = shape
  }
}

export function registerContainer(world) {
  world.registerType(ShapeContainer)
}