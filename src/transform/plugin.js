import {
  Position2D,
  Orientation2D,
  Scale2D,
  Position3D,
  Orientation3D,
  Scale3D,
  GlobalTransform2D,
  GlobalTransform3D
} from './components/index.js'
import { Dimension } from '../utils/index.js'
import { App, AppSchedule } from '../app/index.js'
import { Query, World } from '../ecs/index.js'

export class TransformPlugin {

  /**
   * @type {TransformPluginOptions}
   */
  options

  /**
   * @param {TransformPluginOptions} options
   */
  constructor(options = {}) {
    options.dimension = options.dimension ?? Dimension.Both
    this.options = options
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { dimension } = this.options

    if (
      dimension === Dimension.Two ||
      dimension === Dimension.Both
    ) {
      app
        .registerType(Position2D)
        .registerType(Orientation2D)
        .registerType(Scale2D)
        .registerType(GlobalTransform2D)
    }
    if (
      dimension === Dimension.Three ||
      dimension === Dimension.Both
    ) {
      app
        .registerType(Position3D)
        .registerType(Orientation3D)
        .registerType(Scale3D)
        .registerType(GlobalTransform3D)
    }
  }
}

/**
 * @typedef TransformPluginOptions
 * @property {Dimension} [dimension]
 */