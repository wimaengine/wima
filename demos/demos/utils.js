import {
  World,
  Cleanup,
  createCamera3D,
  EntityCommands,
  createCamera2D,
  Plugin,
  App,
  typeidGeneric,
  Gizmo2D
} from 'wima'

// gizmo labels
export class Demo1 {}
export class Demo2 {}

/** @augments Gizmo2D<Demo1> */
export class Demo1Gizmo2D extends Gizmo2D {}

/** @augments Gizmo2D<Demo2> */
export class Demo2Gizmo2D extends Gizmo2D {}

/**
 * @param {World} world
 */
export function addDefaultCamera3D(world) {
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab([...createCamera3D(0, 0, 2), new Cleanup()])
    .build()
}

/**
 * @param {World} world
 */
export function addDefaultCamera2D(world) {
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab([...createCamera2D(), new Cleanup()])
    .build()
}

export class ResourceAliasPlugin extends Plugin {

  /**
   * @param {App} app 
   */
  register(app) {
    const world = app.getWorld()

    world.setResourceAlias(typeidGeneric(Gizmo2D, [Demo1]), Demo1Gizmo2D)
    world.setResourceAlias(typeidGeneric(Gizmo2D, [Demo2]), Demo2Gizmo2D)
  }
}