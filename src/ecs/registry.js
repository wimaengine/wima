/** @import { ComponentId, Tuple, Entity } from './typedef/index.js'*/

import { ArchetypeTable } from './tables/index.js'
import { TypeStore } from './typestore.js'
import { assert } from '../logger/index.js'
import { ComponentHooks } from './component/index.js'

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
   * @type {number[]}
   */
  entities = []
  constructor() {

    // Because the type `Entity` is a typedef, not an actual class.
    // @ts-ignore
    this.typestore.set({
      name: 'entity'
    })
  }

  /**
   * @returns {Readonly<number[]>}
   */
  getEntities() {
    return this.entities
  }

  /**
   * @template {Tuple} T
   * @param {T} components
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
   * @param {string[]} names
   * @returns {ComponentId[]}
   */
  getComponentIdsByName(names) {

    /** @type {ComponentId[]} */
    const ids = []

    for (let i = 0; i < names.length; i++) {
      const name = names[i]
      const id = this.typestore.getId(name)

      assert(id !== void 0, `The component "${name}" has not been registered into the \`World\`.Use \`App.registerType()\` or \`World.registerType()\`to add it.`)

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
   * @template {Tuple} T
   * @param {T} components - The entity to add.
   * @returns {Entity}
   */
  create(components) {
    const entity = this.entities.length
    const ids = this.getComponentIds(components)

    assert(ids, `Cannot insert "${components.map((e) => `\`${e.constructor.name}\``).join(', ')}" into \`ArchetypeTable\`.Ensure that all of them are registered properly using \`World.registerType()\``)

    ids.push(0)
    components.push(entity)

    const [id, index] = this.table.insert(components, ids)

    this.entities[entity] = id
    this.entities[entity + 1] = index
    this.callAddComponentHook(entity, ids)

    return entity
  }

  /**
   * Inserts components into an entity.
   *
   * @template {Tuple} T
   * @param {Entity} entity
   * @param {T} components - The entity to add.
   */
  insert(entity, components) {
    const archid = this.entities[entity]
    const index1 = this.entities[entity + 1]
    const ids = this.getComponentIds(components)

    assert(ids, `Cannot insert "${components.map((e) => `\`${e.constructor.name}\``).join(', ')}" into \`World\`.Ensure that all of them are registered properly using \`World.registerType()\``)

    const [idextract, extract] = this.table.extract(archid, index1)

    this.table.remove(archid, index1)

    const combined = [...components, ...extract]
    const combinedid = [...ids, ...idextract]

    const [id, index] = this.table.insert(combined, combinedid)
    const swapped = this.table.get(archid, index1, 0)

    this.entities[entity] = id
    this.entities[entity + 1] = index

    if (swapped) this.entities[swapped + 1] = index1

    this.callInsertComponentHook(entity, idextract)
    this.callAddComponentHook(entity, ids)
  }

  /**
   * @template {Tuple} T
   * @param {T[]} entities
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
    const archid = this.entities[entity]
    const index = this.entities[entity + 1]

    // Todo - Use a method that only returns the component ids
    const [extractid] = this.table.extract(archid, index)

    this.callRemoveComponentHook(entity, extractid)
    this.table.remove(archid, index)

    // Because `Entity` is guaranteed to have a `ComponentId` of 0.
    const swapped = this.table.get(archid, index, 0)

    this.entities[entity] = -1
    this.entities[entity + 1] = -1

    if (swapped) this.entities[swapped + 1] = index
  }

  /**
   * @template T
   * @param {Entity} entity
   * @param { string  } compName
   * @returns {T | null}
   */
  get(entity, compName) {
    const archid = this.entities[entity]
    const index = this.entities[entity + 1]
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
   * @param {string} name
   * @returns {T}
   */
  getResource(name) {
    return this.resources[name]
  }

  /**
   * @template {object} T
   * @param {T} resource
   */
  setResource(resource) {
    this.resources[resource.constructor.name.toLowerCase()] = resource
  }

  /**
   * @param {Function} type
   */
  registerType(type) {
    this.typestore.set(type)
  }

  /**
   * @template T
   * @param {string} componentname
   * @param {ComponentHooks} hooks
   */
  setComponentHooks(componentname, hooks) {
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