/** @import { EntityCell, EntityHandle, World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'
import { Parent } from '@wimaengine/hierarchy'
import { throws } from '@wimaengine/logger'
import { Affine2, Affine3 } from '@wimaengine/math'
import {
  GlobalTransform2D,
  GlobalTransform3D,
  Orientation2D,
  Orientation3D,
  Position2D,
  Position3D,
  Scale2D,
  Scale3D
} from '@wimaengine/transform'

/**
 * @param {World} world
 * @param {EntityHandle} candidate
 * @param {EntityHandle} entity
 * @returns {boolean}
 */
function isDescendant(world, candidate, entity) {
  let current = candidate

  while (current) {
    if (current.equals(entity)) {
      return true
    }

    current = world.get(current, Parent)?.entity
  }

  return false
}

/**
 * @param {EntityCell} entity
 * @param {EntityCell | undefined} newParent
 */
function reparentTransforms(entity, newParent) {
  const worldTransform2D = entity.get(GlobalTransform2D)
  const position2D = entity.get(Position2D)
  const orientation2D = entity.get(Orientation2D)
  const scale2D = entity.get(Scale2D)

  if (worldTransform2D && position2D && orientation2D && scale2D) {
    const parentTransform2D = newParent?.get(GlobalTransform2D)
    const localTransform2D = parentTransform2D ?
      Affine2.multiply(
        Affine2.invert(parentTransform2D, new Affine2()),
        worldTransform2D,
        new Affine2()
      ) :
      worldTransform2D
    const [nextPosition2D, nextOrientation2D, nextScale2D] = localTransform2D.decompose()

    position2D.x = nextPosition2D.x
    position2D.y = nextPosition2D.y

    orientation2D.cos = nextOrientation2D.cos
    orientation2D.sin = nextOrientation2D.sin

    scale2D.x = nextScale2D.x
    scale2D.y = nextScale2D.y
  }

  const worldTransform3D = entity.get(GlobalTransform3D)
  const position3D = entity.get(Position3D)
  const orientation3D = entity.get(Orientation3D)
  const scale3D = entity.get(Scale3D)

  if (worldTransform3D && position3D && orientation3D && scale3D) {
    const parentTransform3D = newParent?.get(GlobalTransform3D)
    const localTransform3D = parentTransform3D ?
      Affine3.multiply(
        Affine3.invert(parentTransform3D),
        worldTransform3D,
        new Affine3()
      ) :
      worldTransform3D
    const [nextPosition3D, nextOrientation3D, nextScale3D] = localTransform3D.decompose()

    position3D.x = nextPosition3D.x
    position3D.y = nextPosition3D.y
    position3D.z = nextPosition3D.z

    orientation3D.x = nextOrientation3D.x
    orientation3D.y = nextOrientation3D.y
    orientation3D.z = nextOrientation3D.z
    orientation3D.w = nextOrientation3D.w

    scale3D.x = nextScale3D.x
    scale3D.y = nextScale3D.y
    scale3D.z = nextScale3D.z
  }
}

export class ReparentCommand extends Command {

  /**
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * @readonly
   * @type {EntityHandle | undefined}
   */
  parent

  /**
   * @param {EntityHandle} entity
   * @param {EntityHandle | undefined} [parent=undefined]
   */
  constructor(entity, parent = undefined) {
    super()
    this.entity = entity
    this.parent = parent
  }

  /**
   * @param {World} world
   */
  execute(world) {
    const { entity, parent } = this
    const cell = world.getEntity(entity)
    const parentCell = parent ? world.getEntity(parent) : undefined
    const parentComponent = cell.get(Parent)

    if (parent && isDescendant(world, parent, entity)) {
      throws(`The entity ${entity.id()} cannot be reparented to itself or one of its descendants.`)
    }

    if (
      (parent === undefined && !parentComponent) ||
      (parent !== undefined && parentComponent?.entity.equals(parent))
    ) {
      return
    }

    reparentTransforms(cell, parentCell)

    if (parentComponent) {
      world.remove(entity, [Parent])
    }

    if (parent !== undefined) {
      world.insert(entity, [new Parent(parent)])
    }
  }
}
