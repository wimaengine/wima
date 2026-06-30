import { deepStrictEqual, strictEqual } from 'assert'
import test, { describe } from 'node:test'
import { Entity, Query, World } from '../../../ecs/index.js'
import { Parent } from '../../../hierarchy/index.js'
import { Scene } from '../../assets/index.js'
import { SceneInstance } from '../../components/index.js'
import { StructInfo } from '../../../reflect/core/index.js'
import { TypeRegistry } from '../../../reflect/resources/index.js'
import { typeid } from '../../../type/index.js'

class PureComponent {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {PureComponent} target
   */
  static clone(target) {
    return new PureComponent(target.value)
  }

  /**
   * @param {World} _world
   * @returns {ComponentSnapshot}
   */
  toSnapshot(_world) {
    return new ComponentSnapshot(this.value)
  }
}

class PureResource {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {PureResource} target
   */
  static clone(target) {
    return new PureResource(target.value)
  }

  /**
   * @param {World} _world
   * @returns {ResourceSnapshot}
   */
  toSnapshot(_world) {
    return new ResourceSnapshot(this.value)
  }
}

class ComponentSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {World} _world
   * @returns {PureComponent}
   */
  fromSnapshot(_world) {
    return new PureComponent(this.value)
  }
}

class ResourceSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {World} _world
   * @returns {PureResource}
   */
  fromSnapshot(_world) {
    return new PureResource(this.value)
  }
}

class PatchableResource {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }
}

class PatchableResourceSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {PatchableResourceSnapshot} sceneResource
   * @param {World} _world
   */
  static patch(sceneResource, _world) {
    if (!_world.hasResource(PatchableResource)) {
      return false
    }

    const worldResource = _world.getResource(PatchableResource)

    worldResource.value = `${worldResource.value}:${sceneResource.value}`

    return true
  }

  /**
   * @param {World} _world
   * @returns {PatchableResource}
   */
  fromSnapshot(_world) {
    throw new Error('`fromSnapshot` should not be called when patching is available')
  }
}

class DeferredPatchResource {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }
}

class DeferredPatchResourceSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {DeferredPatchResourceSnapshot} _sceneResource
   * @param {World} _world
   * @returns {boolean}
   */
  static patch(_sceneResource, _world) {
    return false
  }

  /**
   * @param {World} _world
   * @returns {DeferredPatchResource}
   */
  fromSnapshot(_world) {
    return new DeferredPatchResource(this.value)
  }
}

/**
 * @returns {TypeRegistry}
 */
function createRegistry() {
  const registry = new TypeRegistry()

  registry.register(Entity, StructInfo.default())
  registry.get(Entity)?.setMethod(/** @param {Entity} target */ function clone(target) {
    return Entity.from(target.id())
  })

  registry.register(PureComponent, StructInfo.default())
  registry.get(PureComponent)?.setMethod(PureComponent.clone)
  registry.get(PureComponent)?.setMethod(PureComponent.prototype.toSnapshot)

  registry.register(ComponentSnapshot, StructInfo.default())
  registry.get(ComponentSnapshot)?.setMethod(ComponentSnapshot.prototype.fromSnapshot)

  registry.register(PureResource, StructInfo.default())
  registry.get(PureResource)?.setMethod(PureResource.clone)
  registry.get(PureResource)?.setMethod(PureResource.prototype.toSnapshot)

  registry.register(ResourceSnapshot, StructInfo.default())
  registry.get(ResourceSnapshot)?.setMethod(ResourceSnapshot.prototype.fromSnapshot)

  return registry
}

describe('Testing `Scene`', { concurrency: false }, () => {
  describe('with pure types', { concurrency: false }, () => {
    test('`Scene.fromWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new Entity(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = new Entity(42, 1)
      const scene = new Scene()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new Entity(99, 1)

      scene.entities.set(entity.id(), [
        new Entity(entity.index, entity.generation)
      ])

      scene.toWorld(world, instance, registry, instanceEntity)

      strictEqual(world.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(world, [Entity]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = world.getEntity(restoredEntity)

      strictEqual(cell.hasTypeid([typeid(Entity), typeid(Parent)]), true)
      deepStrictEqual(cell.get(Entity), restoredEntity)
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })

    test('`Scene.fromWorld` restores pure resources', () => {
      const registry = createRegistry()
      const world = new World()

      world.setResource(new PureResource('resource'))

      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 0)
      strictEqual(scene.resources.size, 1)
      deepStrictEqual(
        scene.resources.get(typeid(ResourceSnapshot)),
        new ResourceSnapshot('resource')
      )
    })

    test('`Scene.toWorld` restores pure resources', () => {
      const registry = createRegistry()
      const scene = new Scene()
      const world = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.resources.set(
        typeid(PureResource),
        new PureResource('resource')
      )

      scene.toWorld(world, instance, registry, new Entity(99, 1))

      strictEqual(new Query(world, [Entity]).count(), 0)
      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(world.getResource(PureResource), new PureResource('resource'))
    })

    test('`Scene.fromWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new ComponentSnapshot('component'),
        new Entity(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)
      const targetWorld = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new Entity(99, 1)

      scene.toWorld(targetWorld, instance, registry, instanceEntity)

      strictEqual(targetWorld.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(targetWorld, [Entity]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = targetWorld.getEntity(restoredEntity)

      strictEqual(
        cell.hasTypeid([typeid(Entity), typeid(PureComponent), typeid(Parent)]),
        true
      )
      deepStrictEqual(cell.get(Entity), restoredEntity)
      deepStrictEqual(cell.get(PureComponent), new PureComponent('component'))
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })
  })

  describe('with snapshots', { concurrency: false }, () => {
    test('`Scene.fromWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new Entity(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = new Entity(42, 1)
      const scene = new Scene()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new Entity(99, 1)

      scene.entities.set(entity.id(), [
        new Entity(entity.index, entity.generation)
      ])

      scene.toWorld(world, instance, registry, instanceEntity)

      strictEqual(world.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(world, [Entity]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = world.getEntity(restoredEntity)

      strictEqual(cell.hasTypeid([typeid(Entity), typeid(Parent)]), true)
      deepStrictEqual(cell.get(Entity), restoredEntity)
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })

    test('`Scene.fromWorld` restores pure resources', () => {
      const registry = createRegistry()
      const world = new World()

      world.setResource(new PureResource('resource'))

      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 0)
      strictEqual(scene.resources.size, 1)
      deepStrictEqual(
        scene.resources.get(typeid(ResourceSnapshot)),
        new ResourceSnapshot('resource')
      )
    })

    test('`Scene.toWorld` restores pure resources', () => {
      const registry = createRegistry()
      const scene = new Scene()
      const world = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.resources.set(
        typeid(ResourceSnapshot),
        new ResourceSnapshot('resource')
      )

      scene.toWorld(world, instance, registry, new Entity(99, 1))

      strictEqual(new Query(world, [Entity]).count(), 0)
      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(world.getResource(PureResource), new PureResource('resource'))
    })

    test('`Scene.fromWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new ComponentSnapshot('component'),
        new Entity(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)
      const targetWorld = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new Entity(99, 1)

      scene.toWorld(targetWorld, instance, registry, instanceEntity)

      strictEqual(targetWorld.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(targetWorld, [Entity]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = targetWorld.getEntity(restoredEntity)

      strictEqual(
        cell.hasTypeid([typeid(Entity), typeid(PureComponent), typeid(Parent)]),
        true
      )
      deepStrictEqual(cell.get(Entity), restoredEntity)
      deepStrictEqual(cell.get(PureComponent), new PureComponent('component'))
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })
  })

  describe('with patching', { concurrency: false }, () => {
    test('`Scene.toWorld` patches existing world resources', () => {
      const registry = new TypeRegistry()
      registry.register(PatchableResource, StructInfo.default())
      registry.register(PatchableResourceSnapshot, StructInfo.default())
      registry.get(PatchableResourceSnapshot)?.setMethod(PatchableResourceSnapshot.patch)
      registry.get(PatchableResourceSnapshot)?.setMethod(PatchableResourceSnapshot.prototype.fromSnapshot)

      const world = new World()
      const worldResource = new PatchableResource('world')
      world.setResource(worldResource)
      world.setResourceAlias(typeid(PatchableResource), PatchableResourceSnapshot)

      const scene = new Scene()
      scene.resources.set(
        typeid(PatchableResourceSnapshot),
        new PatchableResourceSnapshot('scene')
      )

      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.toWorld(world, instance, registry, new Entity(99, 1))

      strictEqual(world.getResource(PatchableResource), worldResource)
      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(worldResource, new PatchableResource('world:scene'))
    })

    test('`Scene.toWorld` restores resources when patching declines', () => {
      const registry = new TypeRegistry()
      registry.register(DeferredPatchResource, StructInfo.default())
      registry.register(DeferredPatchResourceSnapshot, StructInfo.default())
      registry.get(DeferredPatchResourceSnapshot)?.setMethod(DeferredPatchResourceSnapshot.patch)
      registry.get(DeferredPatchResourceSnapshot)?.setMethod(DeferredPatchResourceSnapshot.prototype.fromSnapshot)

      const scene = new Scene()
      scene.resources.set(
        typeid(DeferredPatchResourceSnapshot),
        new DeferredPatchResourceSnapshot('resource')
      )

      const world = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.toWorld(world, instance, registry, new Entity(99, 1))

      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(world.getResource(DeferredPatchResource), new DeferredPatchResource('resource'))
    })
  })
})
