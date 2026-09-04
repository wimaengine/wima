import { test, describe } from "vitest";
import { strictEqual, throws } from "node:assert";
import { App, Plugin } from "../src";
import { typeid } from "@wimaengine/type";

class ProvidedPlugin extends Plugin { }

class ChildPlugin extends Plugin {
  requires() {
    return [typeid(ProvidedPlugin)]
  }
}

class ProviderBootstrapPlugin extends Plugin {
  register(app) {
    app.registerPlugin(new ProvidedPlugin())
  }
}

class ParentPlugin extends Plugin {
  register(app) {
    app.registerPlugin(new ChildPlugin())
  }
}

class BootstrapPlugin extends Plugin {
  register(app) {
    app.registerPlugin(new ProviderBootstrapPlugin())
  }
}

class MissingPlugin extends Plugin { }

class MissingDependencyPlugin extends Plugin {
  requires() {
    return [typeid(MissingPlugin)]
  }
}

class FinishResource { }

class FinishPlugin extends Plugin {
  finish(app) {
    strictEqual(app.initialized, false)
    app.setResource(finishResource)
  }
}

const finishResource = new FinishResource()

describe("Testing `App` plugin registry behavior", () => {
  test("`App.hasPlugin` checks by type id", () => {
    const app = new App()

    app.registerPlugin(new ParentPlugin())

    strictEqual(app.hasPlugin(typeid(ParentPlugin)), true)
    strictEqual(app.hasPlugin(typeid(ProvidedPlugin)), false)
  })

  test("`App.run` validates plugins registered during registration", () => {
    const app = new App()

    app
      .registerPlugin(new ParentPlugin())
      .registerPlugin(new BootstrapPlugin())
      .setRunner(() => {})
      .run()

    strictEqual(app.hasPlugin(typeid(ProvidedPlugin)), true)
    strictEqual(app.hasPlugin(typeid(ChildPlugin)), true)
  })

  test("`App.run` throws when a plugin dependency is missing", () => {
    const app = new App()

    app
      .registerPlugin(new MissingDependencyPlugin())
      .setRunner(() => {})

    throws(() => app.run(), /requires .* but it is not registered/)
  })

  test("`Plugin.finish` runs after dependencies are checked and before resources are flushed", () => {
    const app = new App()
    const world = class DefaultWorld { }

    app
      .setWorld(world)
      .defaultWorld(world)
      .setRunner(() => {})
      .registerPlugin(new FinishPlugin())
      .run()

    strictEqual(app.getWorld(world).getResource(FinishResource), finishResource)
  })
})
