/**
 * @template T
 */
export class Signal {

  /**
   * @type {signalListener<T>[]}
   */
  listeners = []

  /**
   * @type {T}
   */
  value

  /**
   * @param {T} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @returns {T}
   */
  getValue() {
    return this.value
  }

  /**
   * @param {T} x
   * @returns {void}
   */
  setValue(x) {
    this.value = x

    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](this.value)
    }
  }

  /**
   * @param {signalListener<T>} listener
   */
  addListener(listener) {
    this.listeners.push(listener)
  }

  /**
   * @param {signalListener<T>} listener
   */
  removeListener(listener) {
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i] === listener) return this.detach(i)
    }
  }

  /**
   * @private
   * @param {number} bindingIndex
   */
  detach(bindingIndex) {
    this.listeners.splice(bindingIndex, 1)
  }
}

/**
 * @template T
 * @callback signalListener
 * @param {T} value
 * @returns {void}
 */