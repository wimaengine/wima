import { deepStrictEqual, notDeepStrictEqual } from "assert";
import test, { describe } from "node:test";
import { Assets, AssetServer, Exporter, Parser } from "../index.js";
import { typeid, typeidGeneric } from "../../type/index.js";
import { World } from "../../ecs/index.js";
import { updateAssets } from "../systems/index.js";
import { Events } from "../../event/index.js";
import { AssetLoadSuccess, AssetSaveSuccess, AssetLoadFail } from "../events/index.js";

class Text {
  inner = ''
  /**
   * @param {string} text
   */
  constructor(text) {
    this.inner = text
  }
}

/**
 * @extends {Parser<Text>}
 */
class TextParser extends Parser {
  constructor(){
    super(Text)
  }
  /**
   * @override
   */
  getExtensions(){
    return ['txt']
  }

  /**
   * @param {Response} response
   */
  async parse(response){
    const text = await response.text()
    return new Text(text)
  }
}

/**
 * @extends {Exporter<Text>}
 */
class TextExporter extends Exporter {
  constructor(){
    super(Text)
  }

  /**
   * @override
   */
  getExtensions(){
    return ['txt']
  }

  /**
   * @param {Text} asset
   */
  async serialize(asset){
    return JSON.stringify(asset)
  }
}

describe('Testing `AssetServer`', () => {
  test('Asset is cached by server.', () => {
    const server = createServer()
    const handle1 = server.load(Text,"/assets/text/sample.txt")
    const handle2 = server.load(Text,"/assets/text/sample.txt")

    deepStrictEqual(handle1.id(),handle2.id())
  })

  test('Unloaded asset gets new handle when reloaded.', () => {
    const server = createServer()
    const handle1 = server.load(Text,"/assets/text/sample.txt")

    
    handle1.drop()
    // simulates `unloadDroppedAssets`
    server.dropAssetInfo(handle1.id())
    
    const handle2 = server.load(Text,"/assets/text/sample.txt")

    notDeepStrictEqual(handle1.id(),handle2.id())
  })

  test('Asset load state cycle.', () => {
    const server = createServer()
    const handle = server.load(Text,"/assets/text/sample.txt")

    deepStrictEqual(server.flushLoadRequests().length, 1)
    deepStrictEqual(handle.id(), server.getAssetInfo(handle).id)
  })

  test('Asset load system parses and stores the asset.', async () => {
    const world = createWorld()
    const server = world.getResource(AssetServer)
    const assets = world.getResourceByTypeId(typeidGeneric(Assets, [Text]))
    const loadSuccessEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadSuccess]))
    const handle = server.load(Text,"/assets/text/sample.txt")

    const originalFetch = globalThis.fetch
    let path

    globalThis.fetch = async (requestPath) => {
      path = requestPath

      return /**@type {Response}*/({
        ok: true,
        statusText: 'OK',
        async text() {
          return 'hello'
        }
      })
    }

    try {
      await updateAssets(world)
      loadSuccessEvents.clear()
      deepStrictEqual(path, '/assets/text/sample.txt')
      deepStrictEqual(assets.get(handle).inner, 'hello')
      deepStrictEqual(loadSuccessEvents.count(), 1)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  test('Asset save uses exporter through the asset system.', async () => {
    const world = createWorld()
    const server = world.getResource(AssetServer)
    const assets = world.getResourceByTypeId(typeidGeneric(Assets, [Text]))
    const saveSuccessEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetSaveSuccess]))
    const handle = assets.add(new Text('hello'))

    let body

    const originalFetch = globalThis.fetch

    globalThis.fetch = async (_path, init) => {
      body = init.body

      return /**@type {Response}*/({
        ok: true,
        statusText: 'OK'
      })
    }

    try {
      server.save(handle, '/assets/text/sample.txt')
      await updateAssets(world)
      saveSuccessEvents.clear()
      deepStrictEqual(body, JSON.stringify({ inner: 'hello' }))
      deepStrictEqual(saveSuccessEvents.count(), 1)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})

function createServer() {
  const assets = new Assets(Text)
  const server = new AssetServer()

  server.registerAsset(assets)
  server.registerParser(Text,new TextParser())
  server.registerExporter(Text,new TextExporter())

  return server
}

function createWorld() {
  const world = new World()
  const assets = new Assets(Text)
  const server = new AssetServer()

  world.setResource(server)
  world.setResourceByTypeId(typeidGeneric(Assets, [Text]), assets)
  world.setResourceByTypeId(typeidGeneric(Events, [AssetLoadSuccess]), new Events())
  world.setResourceByTypeId(typeidGeneric(Events, [AssetSaveSuccess]), new Events())
  world.setResourceByTypeId(typeidGeneric(Events, [AssetLoadFail]), new Events())
  server.registerAsset(assets)
  server.registerParser(Text,new TextParser())
  server.registerExporter(Text,new TextExporter())

  return world
}
