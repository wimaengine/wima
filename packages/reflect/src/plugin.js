import { App, Plugin } from '@wimaengine/app'
import { TypeRegistry } from './resources'

export class ReflectPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const typeregistry = new TypeRegistry()

    app
      .setResource(typeregistry)
  }
}
