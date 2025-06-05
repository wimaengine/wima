/** @import { ComponentId } from './typedef/index.js'*/
/** @import { Constructor } from '../reflect/index.js'*/

import { ArchetypeTable } from './tables/index.js'
import { TypeStore } from './typestore.js'
import { assert } from '../logger/index.js'
import { ComponentHooks } from './component/index.js'
import { Entities, Entity } from './entities/index.js'
import { EntityLocation } from './entities/location.js'

export class World {

  /**
   * @private
   */
  table = new ArchetypeTable()

  /**
   * @private
   * @type {Record<string,any>}
   */
  resources = {}

  /**
   * @private
   * @type {TypeStore}
   */
  typestore = new TypeStore()

  /**
   * @private
   * @type {Entities}
   */
  entities = new Entities()
  constructor() {
    this.typestore.set(Entity)
  }

  /**
   * @returns {Readonly<Entities>}
   */
  getEntities() {
    return this.entities
  }

  /**
   * @template {Constructor[]} T
   * @param {[...T]} components
   * @returns {ComponentId[]}
   */
  getComponentIds(components) {

    /** @type {ComponentId[]} */
    const ids = []

    for (let i = 0; i < components.length; i++) {
      const name = components[i].constructor.name.toLowerCase()
      const id = this.typestore.getId(name)

      assert(id !== void 0, `The component "${name}" has not been registered into the \`World\`.Use \`World.registerType()\`to add it.`)

      // @ts-ignore
      ids.push(id)
    }

    return ids
  }

  /**
   * @private
   * @param {Entity} entity 
   * @param {ComponentId[]} ids
   */
  callAddComponentHook(entity, ids) {
    for (let i = 0; i < ids.length; i++) {
      const hook = this.typestore.getById(ids[i])?.getHooks().add

      if (hook) hook(entity, this)
    }
  }

  /**
   * @private
   * @param {Entity} entity 
   * @param {ComponentId[]} ids
   */
  callRemoveComponentHook(entity, ids) {
    for (let i = 0; i < ids.length; i++) {
      const hook = this.typestore.getById(ids[i])?.getHooks().remove

      if (hook) hook(entity, this)
    }
  }

  /**
   * @private
   * @param {Entity} entity 
   * @param {ComponentId[]} ids
   * 
   */
  callInsertComponentHook(entity, ids) {
    for (let i = 0; i < ids.length; i++) {
      const hook = this.typestore.getById(ids[i])?.getHooks().insert

      if (hook) hook(entity, this)
    }
  }

  /**
   * Adds an entity to the registry.
   *
   * @template {{}[]} T
   * @param {[...T]} components - The entity to add.
   * @returns {Entity}
   */
  create(components) {
    const entityIndex = this.entities.reserve()

    // SAFETY: the entity was reserved in this function so we know its there.
    const location = /** @type {EntityLocation}*/(this.entities.get(entityIndex))
    const ids = this.getComponentIds(components)
    const entity = new Entity(entityIndex)
    
    assert(ids, `Cannot insert "${components.map((e) => `\`${e.constructor.name}\``).join(', ')}" into \`ArchetypeTable\`.Ensure that all of them are registered properly using \`World.registerType()\``)
    
    ids.push(0)
    components.push(entity)
    
    const [id, tableIndex] = this.table.insert(components, ids)
    

    location.archid = id
    location.index = tableIndex
    this.callAddComponentHook(entity, ids)
    
    return entity
  }

  /**
   * Inserts components into an entity.
   *
   * @template {{}[]} T
   * @param {Entity} entity
   * @param {[...T]} components - The entity to add.
   */
  insert(entity, components) {
    const location = this.entities.get(entity.index)
    
    assert(location, 'Cannot insert to an entity not created on the world.Use `World.create()` then try to insert the given entity into the world.')

    const { archid, index } = location
    const ids = this.getComponentIds(components)

    assert(ids, `Cannot insert "${components.map((e) => `\`${e.constructor.name}\``).join(', ')}" into \`World\`.Ensure that all of them are registered properly using \`World.registerType()\``)

    const extracted = this.table.extract(archid, index)

    assert(extracted, 'Invalid extraction on insert')

    const [idextract, extract] = extracted

    this.table.remove(archid, index)

    const combined = [...components, ...extract]
    const combinedid = [...ids, ...idextract]

    const [id, newIndex] = this.table.insert(combined, combinedid)
    const swapped = /** @type {Entity}*/(this.table.get(archid, index, 0))

    location.archid = id
    location.index = newIndex

    if (swapped){
      const swappedlocation = /** @type {EntityLocation} */(this.entities.get(swapped.index))

      swappedlocation.index = index
    }

    this.callInsertComponentHook(entity, idextract)
    this.callAddComponentHook(entity, ids)
  }

  /**
   * @template {{}[]} T
   * @param {[...T][]} entities
   */
  createMany(entities) {
    for (let i = 0; i < entities.length; i++) {
      this.create(entities[i])
    }
  }

  /**
   * Removes an entity from the registry.
   * Note that this doesn't destroy the entity, only removes it and its components from the manager.
   * To destroy the entity,use `Entity.destroy()` method.
   *
   * @param {Entity} entity - The entity to remove.
   */
  remove(entity) {
    const location = this.entities.get(entity.index)

    if(!location) return

    const { archid, index } = location

    // TODO - Use a method that iterates through componentlists to call remove hook.
    const extracted = this.table.extract(archid, index)

    if(extracted){
      const [extractid] = extracted

      this.callRemoveComponentHook(entity, extractid)
    }

    this.table.remove(archid, index)

    // SAFETY: Because `Entity` is guaranteed to have a `ComponentId` of 0.
    const swapped = /** @type {Entity | null}*/(this.table.get(archid, index, 0))

    location.archid = -1
    location.index = -1
    this.entities.recycle(entity.index)

    if (swapped){
      const swappedlocation = /** @type {EntityLocation} */(this.entities.get(swapped.index))

      swappedlocation.index = index
    }
  }

  /**
   * @template T
   * @param {Entity} entity
   * @param { new (...args:any[])=> T} type
   * @returns {T | null}
   */
  get(entity, type) {
    const location = this.entities.get(entity.index)
    const compName = type.name.toLowerCase()

    if(!location) return null

    const { archid, index } = location
    const id = this.typestore.getId(compName)

    assert(id, `The component ${compName} is not registered into the \`World\`.Use \`World.registerType()\` to register it.`)

    return this.table.get(archid, index, id)
  }

  /**
   * @returns {ArchetypeTable}
   */
  getTable() {
    return this.table
  }

  /**
   * @template T
   * @param {new (...args:any[])=>T} resourceType
   * @returns {T}
   */
  getResource(resourceType) {
    const { name } = resourceType
    const resource = this.resources[name.toLowerCase()]

    assert(resource, `The resource \`${name}\` does not exist in the world.`)

    return resource
  }

  /**
   * @template T
   * @param {string} name
   * @returns {T}
   */
  getResourceByName(name) {
    return this.resources[name]
  }

  /**
   * @template T
   * @param {string} name
   * @param {T} resource
   * @returns {void}
   */
  setResourceByName(name, resource) {
    this.resources[name] = resource
  }

  /**
   * @template {object} T
   * @param {T} resource
   */
  setResource(resource) {
    this.resources[resource.constructor.name.toLowerCase()] = resource
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   */
  registerType(type) {
    this.typestore.set(type)
  }

  /**
   * @template T
   * @param {Constructor<T>} component
   * @param {ComponentHooks} hooks
   */
  setComponentHooks(component, hooks) {
    const componentname = component.name.toLowerCase()
    const info = this.typestore.get(componentname)

    assert(info, `The component "${componentname}" has not been registered.Use \`World.registerType()\` to add it.`)
    info.setHooks(hooks)
  }

  /**
   * This removes all of the entities and components from the manager.
   */
  clear() {
    this.table.clear()
  }
}