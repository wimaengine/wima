import {
  World,
  Cleanup,
  createCamera3D,
  EntityCommands,
  createCamera2D,
  Plugin,
  App,
  Assets,
  Mesh,
  typeidGeneric,
  BasicMaterial,
  Image,
  Audio
} from 'wima'

/**
 * @augments {Assets<Mesh>}
 */
export class MeshAssets extends Assets { }

/**
 * @augments {Assets<BasicMaterial>}
 */
export class BasicMaterialAssets extends Assets { }

/**
 * @augments {Assets<Image>}
 */
export class ImageAssets extends Assets { }

/**
 * @augments {Assets<Audio>}
 */
export class AudioAssets extends Assets { }

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

    world.setResourceAlias(typeidGeneric(Assets, [Image]), ImageAssets)
    world.setResourceAlias(typeidGeneric(Assets, [Audio]), AudioAssets)
    world.setResourceAlias(typeidGeneric(Assets, [Mesh]), MeshAssets)
    world.setResourceAlias(typeidGeneric(Assets, [BasicMaterial]), BasicMaterialAssets)
  }
}