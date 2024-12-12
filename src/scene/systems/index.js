export function spawnScenes(world) {
  const scenes = world.getResource("assets<scene>")
  const commands = world.getResource("entitycommands")
  const spawner = world.getResource("scenespawner")
  const instance = new SceneInstance()
  const events = world.getResource("events<assetloadsuccess>")
  //iterate through the scene world and spawn entities into the actual world.
  //also fill the scene instance with a mapping of the entities provided.
  events.each((event)=>{
    
  })
  spawner.each((handle, entity) => {
    const scene = scenes.getByHandle(handle)
    const query = new Query(scene.world, ["entity"])
    
    spawner.remove()
  })

}