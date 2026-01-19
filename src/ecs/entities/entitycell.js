/** @import { Constructor,TypeId } from '../../reflect/index.js' */
/** @import {World} from '../registry.js' */
import { typeid } from '../../reflect/index.js'
import { Archetypes } from '../archetype/index.js'
import { Tables } from '../tables/index.js'
import { Entity } from './entity.js'
import { EntityLocation } from './location.js'

// TODO: This currently does not work with adding or removing components,
// it can be improved to do that but it will require removing the same
// functionality on the `World` class to avoid conflicting acesses.
export class EntityCell {

  /**
   * @private
   * @type {Entity}
   */
  entity

  /**
   * @type {EntityLocation}
   */
  location

  /**
   * @type {Tables}
   */
  tables

  /**
   * @type {Archetypes}
   */
  archetypes

  /**
   * @param {World} world
   * @param {Entity} entity
   */
  constructor(world, entity) {
    const entities = world.getEntities()
    const location = entities.get(entity.index)

    if (location && location.generation === entity.generation) {
      this.location = location
    } else {
      this.location = new EntityLocation()
    }

    this.tables = world.getTables()
    this.archetypes = world.getArchetypes()
    this.entity = entity
  }

  /**
   * @returns {boolean}
   */
  exists() {
    return (
      this.location.archetypeId !== -1 &&
      this.location.tableId !== -1 &&
      this.location.index !== -1
    )
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   * @returns {T | undefined}
   */
  get(type) {
    const component = this.getTypeId(typeid(type))

    // SAFETY: Component has same `TypeId` as the `type`
    return /** @type {T} */(component)
  }

  /**
   * @param {TypeId} typeid
   * @returns {unknown}
   */
  getTypeId(typeid) {
    const { tableId, index } = this.location
    const table = this.tables.get(tableId)

    return table.get(typeid, index)
  }

  /**
   * @template T
   * @param {Constructor<T>[]} types
   * @returns {boolean}
   */
  has(types) {
    return this.hasTypeid(types.map((type) => typeid(type)))
  }

  /**
   * @param {TypeId[]} typeids
   * @returns {boolean}
   */
  hasTypeid(typeids) {
    const { archetypeId } = this.location
    const archetype = this.archetypes.get(archetypeId)

    return archetype.has(typeids)
  }

  /**
   * @returns {readonly TypeId[]}
   */
  components() {
    const archetype = this.archetypes.get(this.location.archetypeId)

    if (archetype) {
      return archetype.types
    }

    return []

  }

  /**
   * @returns {Entity}
   */
  id() {
    return this.entity
  }
}
