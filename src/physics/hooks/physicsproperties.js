/** @import { ComponentHook } from '../../ecs/index.js'*/
import { Collider2D } from '../components/index.js'
import { warn } from '../../logger/index.js'


/**
 * @type {ComponentHook}
 */
export function physicspropertiesAddHook(entity, world) {
  const component = world.get(entity, 'physicsproperties')
  const collider = world.get(entity, 'collider2d')

  if (!collider)return warn(`No \`Collider2D\` component detected on entity ${entity}.Note that this entity's body will misbehave.`)
  
  const mass = component.invmass ? 1 / component.invmass : 0
  const inertia = Collider2D.calcInertia(collider, mass)

  component.invinertia = inertia ? 1 / inertia : 0
}