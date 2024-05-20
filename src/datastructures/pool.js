/**
 * @template T
 * An extendable object pool for optimizing performance.
 */

export class Pool {

  /**
   * List of objects.
   *
   * @type {T[]}
   */
  pool = []

  /**
   * @readonly
   * @type {PoolCreateFunc<T>}
   */
  create

  /**
   * @param {PoolCreateFunc<T>} create
   * @param {number} number - Number of objects to create at the initialization.
   */
  constructor(create, number = 100) {
    this.create = create

    for (let i = 0; i < number; i++) {
      this.pool.push(this.create())
    }
  }

  /**
   * The number of objects available in the pool.
   *
   * @type {number}
   */
  get size() {
    return this.pool.length
  }
  set size(x) {
    const d = this.pool.length - x

    if (d < 0) {
      for (let i = d; i < 0; i++) {
        this.pool.push(this.create())
      }

      return
    }
    if (d > 0) {
      for (let i = d; i > 0; i--) {
        this.pool.pop()
      }

      return
    }
  }

  /**
   * Gives an object ownership.
   *
   * @returns {T}
   */
  give() {
    const p = this.pool.pop()

    if (p) return p

    return this.create()
  }

  /**
   * Takes an object's ownership.
   * Do not use the taken object and remove all references of it outside otherwise you will get some wierd behaviour.
   *
   * @param {T} obj
   */
  take(obj) {
    this.pool.push(obj)
  }
}

/**
 * @template T
 * @callback PoolCreateFunc
 * @returns {T}
 */