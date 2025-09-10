/** @import { QueryFilter, TupleConstructor,EntityId } from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
import { Query, World, Entity } from '../../ecs/index.js'
import { VisitEntities } from './visitentities.js'

/**
 * @template {VisitEntities} Relationship
 * @template {VisitEntities} [Target = Relationship]
 * @template {unknown[]} [Data = [Entity]]
 * @template {QueryFilter[]} [Filter = []]
 */
export class RelationshipQuery {

  /**
   * @readonly
   * @type {Constructor<Relationship>}
   */
  relationship

  /**
   * @readonly
   * @type {Constructor<Target>}
   */
  target

  /**
   * @private
   * @type {Query<[Relationship,...Data], Filter>} 
   */
  ancestors

  /**
   * @private
   * @type {Query<[Target,...Data], Filter>} 
   */
  descendants

  /**
   * @param {World} world
   * @param {Constructor<Relationship>} relationship
   * @param {Constructor<Target>} target
   * @param {[...TupleConstructor<Data>]} data
   * @param {[...Filter]} [filter]
   */
  constructor(
    world,
    relationship,

    // SAFETY: matches the default `Target`.
    target = /** @type {Constructor<Target>}*/ (/** @type {unknown} */ (relationship)),

    // SAFETY: matches the default `Data`.
    data = /** @type {[...TupleConstructor<Data>]} */([Entity]),

    // SAFETY: matches the default `Filter`.
    filter = /** @type {Filter}*/([])
  ) {
    this.relationship = relationship
    this.target = target

    // SAFETY: `components` instance type is the same type as `Data` generic,
    // no idea why ts is not catching that.
    this.ancestors = /** @type {Query<[Relationship, ...Data],Filter>} */ (new Query(world, [relationship, ...data], filter))
    this.descendants = /** @type {Query<[Target, ...Data],Filter>} */ (new Query(world, [target, ...data], filter))
  }

  /**
   * @param {Entity} entity
   * @param { (descendant: Data, ancestor: Data) => void } visit
   */
  treebfs(entity, visit) {
    const queue = [entity]

    while (queue.length) {

      // SAFETY: `stack` is dense and an element is guaranteed to exist
      // as we check the length above.
      const ancestorEntity = /** @type {Entity}*/(queue.shift())
      const ancestor = this.ancestors.get(ancestorEntity)

      if (!ancestor) continue

      const [relationship, ...ancestorData] = ancestor
      const descendants = relationship.visit()

      queue.push(...descendants)

      for (let i = 0; i < descendants.length; i++) {

        const descendant = this.descendants.get(descendants[i])

        if (!descendant) continue

        const [, ...descendantData] = descendant

        visit(descendantData, ancestorData)
      }
    }
  }

  /**
   * @param {Entity} entity
   * @param { (descendant: Data, ancestor: Data) => void } visit
   */
  treedfs(entity, visit) {

    /** @type {[Entity,Entity][]} */
    const stack = []
    const root = this.ancestors.get(entity)

    if (!root) return

    const [relationship] = root

    stack.push(
      ...relationship.visit()
        .map((c) => /** @type {[Entity,Entity]} */([entity, c]))
        .reverse()
    )

    while (stack.length) {
      const [ancestorEntity, descendantEntity] = stack.pop()
      const ancestor = this.ancestors.get(ancestorEntity)
      const descendant = this.descendants.get(descendantEntity)

      if (!ancestor || !descendant) continue

      const [, ...descendantData] = descendant
      const [, ...ancestorData] = ancestor

      visit(descendantData, ancestorData)

      const grand = this.ancestors.get(descendantEntity)

      if (grand) stack.push(
        ...grand[0].visit()
          .map((c) => /** @type {[Entity,Entity]} */([descendantEntity, c]))
          .reverse()
      )
    }
  }

  /**
   * @param {Entity} entity
   * @param { (descendant: Data, ancestor: Data) => void } visit
   */
  graphbfs(entity, visit) {
    const queue = [entity]

    /** @type {Set<EntityId>} */
    const visited = new Set()

    while (queue.length) {

      // SAFETY: `stack` is dense and an element is guaranteed to exist
      // as we check the length above.
      const ancestorEntity = /** @type {Entity}*/(queue.shift())
      const ancestorEntityId = ancestorEntity.id()
      const ancestor = this.ancestors.get(ancestorEntity)

      if (visited.has(ancestorEntityId)) continue
      if (!ancestor) continue

      const [relationship, ...ancestorData] = ancestor
      const descendants = relationship.visit().filter((e) => !visited.has(e.id()))

      queue.push(...descendants)
      visited.add(ancestorEntityId)

      for (let i = 0; i < descendants.length; i++) {
        const descendantEntity = descendants[i]
        const descendant = this.descendants.get(descendantEntity)

        if (!descendant) continue

        const [, ...descendantData] = descendant

        visit(descendantData, ancestorData)
      }
    }
  }

  /**
   * @param {Entity} entity
   * @param { (descendant: Data, ancestor: Data) => void } visit
   */
  graphdfs(entity, visit) {

    /** @type {[Entity,Entity][]} */
    const stack = []

    /** @type {Set<EntityId>} */
    const visited = new Set()
    const root = this.ancestors.get(entity)

    if (!root) return

    const [rootRelationship] = root

    stack.push(
      ...rootRelationship.visit()
        .map((c) => /** @type {[Entity,Entity]} */([entity, c]))
        .reverse()
    )
    while (stack.length) {
      const [ancestorEntity, descendantEntity] = stack.pop()

      if (visited.has(descendantEntity.id())) continue

      const ancestor = this.ancestors.get(ancestorEntity)
      const descendant = this.descendants.get(descendantEntity)

      if (!ancestor || !descendant) continue

      const [, ...descendantData] = descendant
      const [, ...ancestorData] = ancestor

      visit(descendantData, ancestorData)
      visited.add(ancestorEntity.id())
      const grand = this.ancestors.get(descendantEntity)

      if (grand) stack.push(
        ...grand[0].visit()
          .map((c) => /** @type {[Entity,Entity]} */([descendantEntity, c]))
          .filter(([e]) => !visited.has(e.id()))
          .reverse()
      )
    }
  }
}