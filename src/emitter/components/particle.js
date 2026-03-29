export class Particle {

  /**
   * @param {Particle} source
   * @param {Particle} target
   */
  static copy(source, target = new Particle()) {
    return target
  }

  /**
   * @param {Particle} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
