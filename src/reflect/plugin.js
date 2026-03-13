import { App, Plugin } from '../app/index.js'
import { OpaqueInfo } from './core/info.js'
import { setTypeId } from './core/typeid.js'
import { TypeRegistry } from './core/typeregistry.js'

export class ReflectPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const typeregistry = new TypeRegistry()

    typeregistry.register(String, new OpaqueInfo())
    typeregistry.register(Number, new OpaqueInfo())
    typeregistry.register(Boolean, new OpaqueInfo())
    typeregistry.registerTypeId(setTypeId('BigInt'), new OpaqueInfo())

    console.log(typeregistry)

    app.setResource(typeregistry)
  }
}
