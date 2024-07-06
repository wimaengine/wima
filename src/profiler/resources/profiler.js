export class Profile {
  lastTick = 0
  delta = 0
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
}