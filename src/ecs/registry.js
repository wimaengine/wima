/** @import { Constructor, TypeId } from '../reflect/index.js'*/
/** @import { TupleConstructor } from './core/index.js'*/
/** @import { ArchetypeId, TableId, TableRow } from './typedef/index.js'*/

import { Table, Tables } from './tables/index.js'
import { TypeStore } from './typestore.js'
import { assert } from '../logger/index.js'
import { ComponentHooks } from './component/index.js'
import { Entities, Entity } from './entities/index.js'
import { Archetypes, Archetype } from './archetype/index.js'
import { EntityLocation } from './entities/location.js'
import { typeid } from '../reflect/index.js'
import { EntityCell } from './entities/entitycell.js'

export class World {

  /**
   * @private
   */
  tables = new Tables()

  /**
   * @private
   * @type {Archetypes}
   */
  archetypes = new Archetypes()

  /**
   * @private
   * @type {Record<string,any>}
   */
  resources = {}

  /**
   * @private
   * @type {Map<TypeId,TypeId>}
   */
  resourceAliases = new Map()

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
   * @private
   * @param {Entity} entity 
   * @param {readonly TypeId[]} newIds
   */
  callAddComponentHook(entity, newIds) {
    for (let i = 0; i < newIds.length; i++) {
      const hook = this.typestore.getByTypeId(newIds[i])?.getHooks().add

      if (hook) hook(entity, this)
    }
  }

  /**
   * @private
   * @param {Entity} entity 
   * @param {readonly TypeId[]} newIds
   */
  callRemoveComponentHook(entity, newIds) {
    for (let i = 0; i < newIds.length; i++) {
      const hook = this.typestore.getByTypeId(newIds[i])?.getHooks().remove

      if (hook) hook(entity, this)
    }
  }

  /**
   * @private
   * @param {Entity} entity 
   * @param {readonly TypeId[]} newIds
   * 
   */
  callInsertComponentHook(entity, newIds) {
    for (let i = 0; i < newIds.length; i++) {
      const hook = this.typestore.getByTypeId(newIds[i])?.getHooks().insert

      if (hook) hook(entity, this)
    }
  }

  /**
   * @param {TypeId[]} typeIds
   * @returns {[TableId, Table, ArchetypeId, Archetype]}
   */
  resolve(typeIds) {
    const actualTypeIds = deduplicate(typeIds)

    const archetype = this.archetypes.getArchetypeWithOnly(actualTypeIds)

    if (archetype) {
      const [id, arch] = archetype
      const { tableId } = arch
      const table = this.tables.get(tableId)

      assert(table, `The archetype ${archetype[0]} has an invalid table.`)

      return [tableId, table, id, arch]
    }

    const [tableId, table] = this.tables.resolveTableFor(typeIds)
    const newArchetype = new Archetype(tableId, typeIds)
    const id = this.archetypes.set(newArchetype)

    return [tableId, table, id, newArchetype]
  }

  /**
   * Adds an entity to the registry.
   *
   * @template {{}[]} T
   * @param {[...T]} components - The entity to add.
   * @returns {Entity}
   */
  spawn(components) {
    const entityIndex = this.entities.reserve()

    // SAFETY: the entity was reserved in this function so we know its there.
    const location = /** @type {EntityLocation}*/ (this.entities.get(entityIndex))

    // SAFETY:Object constructors can be casted from `Function` to `Constructor`
    const newIds = (components.map((c) => typeid( /** @type {Constructor} */ (c.constructor))))
    const entity = new Entity(entityIndex)

    newIds.push(typeid(Entity))
    components.push(entity)

    const [tableId, table, archetypeId] = this.resolve(newIds)
    const tableRow = table.insert(newIds, components)

    location.tableId = tableId
    location.archetypeId = archetypeId
    location.index = tableRow
    this.callAddComponentHook(entity, newIds)

    return entity
  }

  /**
   * Inserts components into an entity.
   *
   * @template {object[]} T
   * @param {Entity} entity
   * @param {[...T]} components - The entity to add.
   */
  insert(entity, components) {
    const location = this.entities.get(entity.index)

    if (!location) {
      return
    }

    // SAFETY:Object constructors can be casted from `Function` to `Constructor`
    const { archetypeId: oldArchetypeId, index, tableId: oldTableId } = location
    const oldArchetype = this.archetypes.get(oldArchetypeId)
    const oldTable = this.tables.get(oldTableId)
    
    if (!oldTable) return

    const newIds = (components.map((c) => typeid( /** @type {Constructor} */ (c.constructor))))
    const existingIds = oldArchetype.types
    const combinedIds = [...existingIds, ...newIds]
    const [newTableId, newTable, newArchetypeId] = this.resolve(combinedIds)
    const newIndex = oldTable.moveTo(newTable, index)
    const swapped = /** @type {Entity | null}*/ (oldTable.get(typeid(Entity), index))

    newTable.insertUnchecked(newIndex, newIds, components)
    location.tableId = newTableId
    location.archetypeId = newArchetypeId
    location.index = newIndex

    if (swapped) {
      const swappedlocation = /** @type {EntityLocation} */ (this.entities.get(swapped.index))
      
      swappedlocation.index = index
    }

    this.callAddComponentHook(entity, newIds)
    this.callInsertComponentHook(entity, existingIds)
  }

  /**
   * @template {unknown[]} T
   * @param {Entity} entity
   * @param {TupleConstructor<T>} components 
   */
  remove(entity, components) {
    const location = this.entities.get(entity.index)
    
    if (!location) {
      return
    }

    const { archetypeId: oldArchetypeId, index, tableId: oldTableId } = location
    const oldArchetype = this.archetypes.get(oldArchetypeId)
    const oldTable = this.tables.get(oldTableId)
    
    if (!oldTable) return
    
    const removedIds = (components.map((c) => typeid(c)))
    const existingIds = oldArchetype.types
    const newIds = removeElements(existingIds, removedIds)
    const [newTableId, newTable, newArchetypeId] = this.resolve(newIds)

    this.callRemoveComponentHook(entity, removedIds)

    const newIndex = oldTable.moveTo(newTable, index)
    const swapped = /** @type {Entity | null}*/ (oldTable.get(typeid(Entity), index))

    location.tableId = newTableId
    location.archetypeId = newArchetypeId
    location.index = newIndex

    if (swapped) {
      const swappedlocation = /** @type {EntityLocation} */ (this.entities.get(swapped.index))

      swappedlocation.index = index
    }

    this.callInsertComponentHook(entity, newIds)
  }

  /**
   * @template {{}[]} T
   * @param {[...T][]} entities
   */
  createMany(entities) {
    for (let i = 0; i < entities.length; i++) {
      this.spawn(entities[i])
    }
  }

  /**
   * Removes an entity from the registry.
   * Note that this doesn't destroy the entity, only removes it and its components from the manager.
   * To destroy the entity,use `Entity.destroy()` method.
   *
   * @param {Entity} entity - The entity to remove.
   */
  despawn(entity) {
    const location = this.entities.get(entity.index)

    if (!location) return
    
    const { archetypeId, tableId, index } = location
    const archetype = this.archetypes.get(archetypeId)
    const table = this.tables.get(tableId)

    if (!archetype || !table) return

    this.callRemoveComponentHook(entity, archetype.types)
    table.remove(index)
    
    // SAFETY: The fetched component is an `Entity`.
    const swapped = /** @type {Entity | null}*/ (table.get(typeid(Entity), index))
    
    // SAFETY: -1 is the invalid identifier
    location.tableId = /** @type {TableId}*/ (-1)
    location.index = /** @type {TableRow}*/ (-1)
    location.archetypeId = /** @type {ArchetypeId}*/ (-1)
    this.entities.recycle(entity.index)

    if (swapped) {

      // SAFETY: The swapped entity still exists.
      const swappedlocation = /** @type {EntityLocation} */ (this.entities.get(swapped.index))

      swappedlocation.index = index
    }
  }

  /**
   * @template T
   * @param {Entity} entity
   * @param { Constructor<T>} type
   * @returns {T | null}
   */
  get(entity, type) {
    const location = this.entities.get(entity.index)

    if (!location) return null

    const { tableId, index } = location
    const table = this.tables.get(tableId)
    const component = table?.get(typeid(type), index)

    // SAFETY: Fetched component with the typeid of `T`
    return /** @type {T | undefined}*/(component)
  }

  /**
   * @param {Entity} entity
   * @returns {EntityCell}
   */
  getEntity(entity){
    return new EntityCell(this,entity)
  }

  /**
   * @returns {Tables}
   */
  getTables() {
    return this.tables
  }
 
  /**
   * @returns {Archetypes}
   */
  getArchetypes() {
    return this.archetypes
  }

  /**
   * @template T
   * @param {Constructor<T>} resourceType
   * @returns {T}
   */
  getResource(resourceType) {
    return this.getResourceByTypeId(typeid(resourceType))
  }

  /**
   * @template T
   * @param {TypeId} id
   * @returns {T}
   */
  getResourceByTypeId(id) {
    const resource = this.resources[id]

    if (resource) {
      return resource
    }

    const aliasedid = this.resourceAliases.get(id)

    assert(aliasedid, `The resource or resource alias \`${id}\` is non existent.`)

    const aliasedResource = this.resources[aliasedid]

    assert(aliasedResource, `The resource alias \`${id}\` points to a non-existent resource \`${aliasedid}\`.`)

    return aliasedResource
  }

  /**
   * @template T
   * @param {TypeId} id
   * @param {T} resource
   * @returns {void}
   */
  setResourceByTypeId(id, resource) {
    this.resources[id] = resource
  }

  /**
   * @template {object} T
   * @param {T} resource
   */
  setResource(resource) {

    // SAFETY: An object's costructor is constructible
    const id = typeid(/** @type {Constructor<T>} */(resource.constructor))

    this.setResourceByTypeId(id, resource)
  }

  /**
   * @template T
   * @param {TypeId} id 
   * @param {Constructor<T>} alias 
   */
  setResourceAlias(id, alias) {
    this.resourceAliases.set(typeid(alias), id)
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
    const id = this.typestore.getOrSet(component)
    const info = this.typestore.getById(id)

    assert(info, `Internal error:The component "${component.name}" has not been registered somehow.`)
    info.setHooks(hooks)
  }

  /**
   * This removes all of the entities and components from the manager.
   */
  clear() {
    this.tables.clear()
  }
}


/**
 * @private
 * @param {TypeId[]} newIds
 * @returns {TypeId[]}
 */
function deduplicate(newIds) {
  return [...new Set(newIds)]
}

/**
 * @private
 * @param {readonly TypeId[]} arr
 * @param {readonly TypeId[]} remove
 * @returns {TypeId[]}
 */
function removeElements(arr, remove) {
  return arr.filter((e) => !remove.includes(e))
}