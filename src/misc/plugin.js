import { TransformPlugin } from '../transform/index.js'
import { App } from '../app/index.js'
import { TimePlugin } from '../time/index.js'
import { ProfilerPlugin } from '../profiler/index.js'

export class DefaultPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerPlugin(new TransformPlugin())
      .registerPlugin(new TimePlugin())
      .registerPlugin(new ProfilerPlugin())
  }
}