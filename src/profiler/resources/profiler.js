export class Profile {
  lastTick = 0
  delta = 0

  /**
   * @param {Profile} value
   */
  static serialize(value) {
    return {
      lastTick: value.lastTick,
      delta: value.delta
    }
  }

  /**
   * @param {ProfileSerial} value
   * @param {Profile} [out]
   */
  static deserialize(value, out = new Profile()) {
    out.lastTick = value.lastTick
    out.delta = value.delta

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ProfileSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('lastTick' in value) || !('delta' in value)) {
      return false
    }

    return typeof value.lastTick === 'number' &&
      typeof value.delta === 'number'
  }
}

export class Profiler {

  /**
   * @type {Map<string,Profile>}
   */
  profiles = new Map()

  /**
   * @param {string} label
   */
  set(label) {
    const profile = new Profile()

    this.profiles.set(label, profile)

    return profile
  }

  /**
   * @param {string} label
   * @returns {Profile | undefined}
   */
  get(label) {
    return this.profiles.get(label)
  }

  /**
   * @param {string} label
   */
  start(label) {
    const isthere = this.get(label)
    const profile = isthere ? isthere : this.set(label)

    profile.lastTick = performance.now()
  }

  /**
   * @param {string} label
   */
  end(label) {
    const profile = this.get(label)

    if (!profile) return

    profile.delta = performance.now() - profile.lastTick
  }

  /**
   * @param {Profiler} value
   */
  static serialize(value) {
    return {
      profiles: Array.from(value.profiles.entries()).map(([label, profile]) => [
        label,
        Profile.serialize(profile)
      ])
    }
  }

  /**
   * @param {ProfilerSerial} value
   * @param {Profiler} [out]
   */
  static deserialize(value, out = new Profiler()) {
    out.profiles = new Map(
      value.profiles.map(([label, profile]) => [label, Profile.deserialize(profile)])
    )

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ProfilerSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('profiles' in value)) {
      return false
    }

    if (!Array.isArray(value.profiles)) {
      return false
    }

    for (let i = 0; i < value.profiles.length; i++) {
      const entry = value.profiles[i]

      if (!Array.isArray(entry) || entry.length !== 2) {
        return false
      }

      const [label, profile] = entry

      if (typeof label !== 'string' || !Profile.validateSerial(profile)) {
        return false
      }
    }

    return true
  }
}

/**
 * @typedef ProfileSerial
 * @property {number} lastTick
 * @property {number} delta
 */

/**
 * @typedef ProfilerSerial
 * @property {[string, ProfileSerial][]} profiles
 */
