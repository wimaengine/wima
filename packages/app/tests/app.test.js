import { test, describe } from "vitest";
import { ok, strictEqual, throws } from "node:assert";
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

  test("`App.registerPlugin` reports a duplicate plugin registered by another plugin", () => {
    const app = new App()
    const parent = new ParentPlugin()

    parent.register = (app) => {
      app.registerPlugin(new ChildPlugin())
      app.registerPlugin(new ChildPlugin())
    }

    let error

    try {
      app
        .registerPlugin(parent)
        .setRunner(() => {})
        .run()
    } catch (caught) {
      error = caught
    }

    ok(error instanceof Error)

    const message = error.message
    const parentId = typeid(ParentPlugin)
    const childId = typeid(ChildPlugin)

    ok(message.includes(`The plugin \`${childId}\` is already registered.`))
    ok(message.includes("Plugin registration stack:"))
    ok(message.includes(`- \`${parentId}\` registered directly on the app`))
    ok(message.includes(`- \`${childId}\` registered by \`${parentId}\``))
  })

  test("`App.run` throws when a plugin dependency is missing", () => {
    const app = new App()

    app
      .registerPlugin(new MissingDependencyPlugin())
      .setRunner(() => {})

    throws(() => app.run(), /requires .* but it is not registered/)
  })

  test("`App.registerPlugin` reports a duplicate plugin registered on app", () => {
    const app = new App()

    let error

    try {
      app
        .registerPlugin(new ChildPlugin())
        .registerPlugin(new ChildPlugin())
    } catch (caught) {
      error = caught
    }

    ok(error instanceof Error)

    const message = error.message
    const childId = typeid(ChildPlugin)

    ok(message.includes(`The plugin \`${childId}\` is already registered.`))
    ok(message.includes("Plugin registration stack:"))
    ok(message.includes(`- \`${childId}\` registered directly on the app`))
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
