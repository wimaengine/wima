import { TransformPlugin } from '../transform/index.js'
import { App, Plugin } from '../app/index.js'
import { TimePlugin } from '../time/index.js'
import { ProfilerPlugin } from '../profiler/index.js'

export class DefaultPlugin extends Plugin {

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