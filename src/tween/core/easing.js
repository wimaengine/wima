/** @import { EasingFn } from '../typedef/index.js' */
/**
 * @readonly
 * @enum {EasingFn}
 */
export const Easing = {

  /**
   * @type {EasingFn}
   */
  linear(x) {
    return x
  },

  /**
   * @type {EasingFn}
   */
  quadraticIn(x) {
    return x * x
  },

  /**
   * @type {EasingFn}
   */
  quadraticOut(x) {
    return x * (2 - x)
  },

  /**
   * @type {EasingFn}
   */
  quadraticInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2
    }

    return -0.5 * ((x2 - 1) * (x2 - 3) - 1)
  },

  /**
   * @type {EasingFn}
   */
  cubicIn(x) {
    return x * x * x
  },

  /**
   * @type {EasingFn}
   */
  cubicOut(x) {
    const x2 = x - 1

    return x2 * x2 * x2 + 1
  },

  /**
   * @type {EasingFn}
   */
  cubicInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2 * x2
    }

    const x3 = x2 - 2

    return 0.5 * (x3 * x3 * x3 + 2)
  },

  /**
   * @type {EasingFn}
   */
  quarticIn(x) {
    return x * x * x * x
  },

  /**
   * @type {EasingFn}
   */
  quarticOut(x) {
    const x2 = x - 1

    return 1 - x2 * x2 * x2 * x2
  },

  /**
   * @type {EasingFn}
   */
  quarticInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2 * x2 * x2
    }

    const x3 = x2 - 2

    return -0.5 * (x3 * x3 * x3 * x3 - 2)
  },

  /**
   * @type {EasingFn}
   */
  quinticIn(x) {
    return x * x * x * x * x
  },

  /**
   * @type {EasingFn}
   */
  quinticOut(x) {
    const x2 = x - 1

    return x2 * x2 * x2 * x2 * x2 + 1
  },

  /**
   * @type {EasingFn}
   */
  quinticInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2 * x2 * x2 * x2
    }

    const x3 = x2 - 2

    return 0.5 * (x3 * x3 * x3 * x3 * x3 + 2)
  },

  /**
   * @type {EasingFn}
   */
  sinusoidalIn(x) {
    return 1 - Math.sin(((1.0 - x) * Math.PI) / 2)
  },

  /**
   * @type {EasingFn}
   */
  sinusoidalOut(x) {
    return Math.sin((x * Math.PI) / 2)
  },

  /**
   * @type {EasingFn}
   */
  sinusoidalInOut(x) {
    return 0.5 * (1 - Math.sin(Math.PI * (0.5 - x)))
  },

  /**
   * @type {EasingFn}
   */
  exponentialIn(x) {
    return x === 0 ? 0 : Math.pow(1024, x - 1)
  },

  /**
   * @type {EasingFn}
   */
  exponentialOut(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  },

  /**
   * @type {EasingFn}
   */
  exponentialInOut(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * Math.pow(1024, x2 - 1)
    }

    return 0.5 * (-Math.pow(2, -10 * (x2 - 1)) + 2)
  },

  /**
   * @type {EasingFn}
   */
  circularIn(x) {
    return 1 - Math.sqrt(1 - x * x)
  },

  /**
   * @type {EasingFn}
   */
  circularOut(x) {
    const x2 = x - 1

    return Math.sqrt(1 - x2 * x2)
  },

  /**
   * @type {EasingFn}
   */
  circularInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return -0.5 * (Math.sqrt(1 - x2 * x2) - 1)
    }

    const x3 = x2 - 2

    return 0.5 * (Math.sqrt(1 - x3 * x3) + 1)
  },

  /**
   * @type {EasingFn}
   */
  elasticIn(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    return -Math.pow(2, 10 * (x - 1)) * Math.sin((x - 1.1) * 5 * Math.PI)
  },

  /**
   * @type {EasingFn}
   */
  elasticOut(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    return Math.pow(2, -10 * x) * Math.sin((x - 0.1) * 5 * Math.PI) + 1
  },

  /**
   * @type {EasingFn}
   */
  elasticInOut(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    const x2 = x * 2

    if (x2 < 1) {
      return -0.5 * Math.pow(2, 10 * (x2 - 1)) * Math.sin((x2 - 1.1) * 5 * Math.PI)
    }

    return 0.5 * Math.pow(2, -10 * (x2 - 1)) * Math.sin((x2 - 1.1) * 5 * Math.PI) + 1
  },

  /**
   * @type {EasingFn}
   */
  backIn(x) {
    const s = 1.70158

    return x === 1 ? 1 : x * x * ((s + 1) * x - s)
  },

  /**
   * @type {EasingFn}
   */
  backOut(x) {
    const s = 1.70158
    const x2 = x - 1

    return x === 0 ? 0 : x2 * x2 * ((s + 1) * x2 + s) + 1
  },

  /**
   * @type {EasingFn}
   */
  backInOut(x) {
    const s = 1.70158 * 1.525
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * (x2 * x2 * ((s + 1) * x2 - s))
    }

    const x3 = x2 - 2

    return 0.5 * (x3 * x3 * ((s + 1) * x3 + s) + 2)
  },

  /**
   * @type {EasingFn}
   */
  bounceIn(x) {
    return 1 - Easing.bounceOut(1 - x)
  },

  /**
   * @type {EasingFn}
   */
  bounceOut(x) {
    if (x < 1 / 2.75) {
      return 7.5625 * x * x
    } else if (x < 2 / 2.75) {
      const x2 = x - 1.5 / 2.75

      return 7.5625 * x2 * x2 + 0.75
    } else if (x < 2.5 / 2.75) {
      const x2 = x - 2.25 / 2.75

      return 7.5625 * x2 * x2 + 0.9375
    }

    const x2 = x - 2.65 / 2.75

    return 7.5625 * x2 * x2 + 0.984375

  },

  /**
   * @type {EasingFn}
   */
  bounceInOut(x) {
    if (x < 0.5) return Easing.bounceIn(x * 2) * 0.5

    return Easing.bounceOut(x * 2 - 1) * 0.5 + 0.5
  }
}