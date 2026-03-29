export class PhysicsProperties {
  invinertia = 0
  invmass = 0
  mask = 0xffffffffn
  group = 0xffffffffn
  sleep = false
  restitution = 0.7
  kineticFriction = 0.6

  /**
   * @param {PhysicsProperties} source
   * @param {PhysicsProperties} target
   */
  static copy(source, target = new PhysicsProperties()) {
    target.invinertia = source.invinertia
    target.invmass = source.invmass
    target.mask = source.mask
    target.group = source.group
    target.sleep = source.sleep
    target.restitution = source.restitution
    target.kineticFriction = source.kineticFriction

    return target
  }

  /**
   * @param {PhysicsProperties} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
