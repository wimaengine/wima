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
    return PhysicsProperties.copy(target)
  }

  /**
   * @param {PhysicsProperties} value
   */
  static serialize(value) {
    return {
      invinertia: value.invinertia,
      invmass: value.invmass,
      mask: value.mask,
      group: value.group,
      sleep: value.sleep,
      restitution: value.restitution,
      kineticFriction: value.kineticFriction
    }
  }

  /**
   * @param {PhysicsPropertiesSerial} value
   * @param {PhysicsProperties} [out]
   */
  static deserialize(value, out = new PhysicsProperties()) {
    out.invinertia = value.invinertia
    out.invmass = value.invmass
    out.mask = value.mask
    out.group = value.group
    out.sleep = value.sleep
    out.restitution = value.restitution
    out.kineticFriction = value.kineticFriction

    return out
  }

  /**
   * @param {PhysicsPropertiesSerial} value
   * @returns {value is PhysicsPropertiesSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('invinertia' in value)
      || !('invmass' in value)
      || !('mask' in value)
      || !('group' in value)
      || !('sleep' in value)
      || !('restitution' in value)
      || !('kineticFriction' in value)
    ) {
      return false
    }

    return typeof value.invinertia === 'number'
      && typeof value.invmass === 'number'
      && typeof value.mask === 'bigint'
      && typeof value.group === 'bigint'
      && typeof value.sleep === 'boolean'
      && typeof value.restitution === 'number'
      && typeof value.kineticFriction === 'number'
  }
}

/**
 * @typedef PhysicsPropertiesSerial
 * @property {number} invinertia
 * @property {number} invmass
 * @property {bigint} mask
 * @property {bigint} group
 * @property {boolean} sleep
 * @property {number} restitution
 * @property {number} kineticFriction
 */
