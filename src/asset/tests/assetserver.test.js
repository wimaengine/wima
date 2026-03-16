import { deepStrictEqual, notDeepStrictEqual } from "assert";
import test, { describe,todo } from "node:test";
import { Assets, AssetServer, Parser } from "../index.js";

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
})

function createServer() {
  const assets = new Assets(Text)
  const server = new AssetServer()

  server.registerAsset(assets)
  server.registerParser(Text,new TextParser())

  return server
}