import { deepStrictEqual, notDeepStrictEqual } from "assert";
import test, { describe,todo } from "node:test";
import { Assets, AssetServer, Exporter, Parser } from "../index.js";
import { typeid } from "../../type/index.js";

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
    todo()
  })

  test('Asset save uses exporter.', async () => {
    const server = createServer()
    const assets = server.getAssets(typeid(Text))
    const handle = assets.add(new Text('hello'))

    const originalFetch = globalThis.fetch
    let body

    globalThis.fetch = async (_path, init) => {
      body = init.body

      return /**@type {Response}*/({
        ok: true,
        statusText: 'OK'
      })
    }

    try {
      await server.save(handle, '/assets/text/sample.txt')
      deepStrictEqual(body, JSON.stringify({ inner: 'hello' }))
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
