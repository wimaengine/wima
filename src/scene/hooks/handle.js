
export function initSceneInstance(entity,world) {
  const spawner = world.getResource("scenespawner")
  const sceneHandle = world.get(entity,"scenehandle")
  
  //the scene may actually not be loaded so we will defer the actual spawning of the below entities to when the scene asset is actually loaded.
  spawner.add(scenehandle,entity)
}

export function removeSceneInstance(entity,world) {
  const commands = world.getResource("entitycommands")
  // Despawn the descendants of the entity.
}