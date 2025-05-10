import {
  World,
  Cleanup,
  createCamera3D,
  EntityCommands
} from 'wima'

/**
 * @param {World} world
 */
export function addCamera3D(world) {
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab(createCamera3D(0, 0, 2))
    .insert(new Cleanup())
    .build()
}