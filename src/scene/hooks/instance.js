
export function initSceneInstance(entity,world) {
  const spawner = world.getResource("scenespawner")
  const sceneHandle = world.get(entity,"sceneinstance")
  
  //the scene may actually not be loaded so we will defer the actual spawning of the scene entities to when the scene asset is actually loaded.
  spawner.add(scenehandle.handle,entity)
}

export function removeSceneInstance(entity,world) {
  const commands = world.getResource("entitycommands")
  
  // TODO - Despawn the descendants of the entity.
  commands.despawn(entity)
}