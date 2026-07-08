import { EntityHandle, has, Query, without, World } from '@wimaengine/ecs'
import { Children, Parent } from '@wimaengine/hierarchy'
import { Affine2, Affine3 } from '@wimaengine/math'
import { RelationshipQuery } from '@wimaengine/relationship'
import { Position2D, Orientation2D, Scale2D, GlobalTransform2D, Position3D, Orientation3D, Scale3D, GlobalTransform3D } from '../components'

/**
 * @param {World} world
 */
export function synctransform2D(world) {
  const query = new Query(world, [Position2D, Orientation2D, Scale2D, GlobalTransform2D])

  query.each(([position, orientation, scale, transform]) => {
    transform.compose(position, orientation, scale)
  })
}

/**
 * @param {World} world
 */
export function synctransform3D(world) {
  const query = new Query(world, [Position3D, Orientation3D, Scale3D, GlobalTransform3D])

  query.each(([position, orientation, scale, transform]) => {
    transform.compose(position, orientation, scale)
  })
}

/**
 * @param {World} world
 */
export function propagateTransform2D(world) {
  const hierachyTransforms = new RelationshipQuery(world, Children, Parent, [GlobalTransform2D])
  const roots = new Query(world, [EntityHandle], [has(Children), without(Parent)])

  roots.each(([entity]) => {
    hierachyTransforms.treebfs(entity, ([childTransform], [parentTransform]) => {
      const finalTransform = Affine2.multiply(parentTransform, childTransform)

      childTransform.copy(finalTransform)
    })
  })
}

/**
 * @param {World} world
 */
export function propagateTransform3D(world) {
  const hierachyTransforms = new RelationshipQuery(world, Children, Parent, [GlobalTransform3D])
  const roots = new Query(world, [EntityHandle], [has(Children), without(Parent)])

  roots.each(([entity]) => {
    hierachyTransforms.treebfs(entity, ([childTransform], [parentTransform]) => {
      const finalTransform = Affine3.multiply(parentTransform, childTransform)

      childTransform.copy(finalTransform)
    })
  })
}
