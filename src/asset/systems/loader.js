import { Device } from '../../device/index.js'
import { World } from '../../ecs/index.js'
import { EventDispatch } from '../../event/index.js'
import { getFileExtension } from '../../utils/index.js'
import { Assets, Parser } from '../core/index.js'
import { AssetLoadFail, AssetLoadSuccess } from '../events/index.js'
import { AssetBasePath } from '../resources/index.js'

/**
 * @template T
 * @param {string} name
 */
export function generateParserSystem(name) {

  /**
   * @param {World} world
   */
  return async function loadToAssets(world) {
        
    /** @type {Assets<T>} */
    const assets = world.getResource(`assets<${name}>`)

    /** @type {Device} */
    const device = world.getResource('device')

    /** @type {Parser<T>} */
    const parser = world.getResource(`parser<${name}>`)

    /** @type {EventDispatch<AssetLoadSuccess>} */
    const success = world.getResource('events<assetloadsuccess>')

    /** @type {EventDispatch<AssetLoadFail>} */
    const fail = world.getResource('events<assetloadfail>')

    /** @type {AssetBasePath} */
    const baseUrl = world.getResource('assetbasepath')

    const paths = assets.flushToLoad()

    if(!parser) return

    for (let i = 0; i < paths.length; i++) {
      const rawpath = paths[i]
      const path = baseUrl.path + rawpath
      const extension = getFileExtension(path)

      if (!parser.verify(extension, device)) {
        fail.write(new AssetLoadFail(rawpath, `The extension "${extension}" is not supported by ${parser.constructor.name}` ))
        continue
      }

      const result = await load(path, parser)

      if(result){
        
        assets.setByPath(rawpath, result)
        success.write(new AssetLoadSuccess(rawpath))
      } else {

        // TODO - Give reasons why asset load failed
        fail.write(new AssetLoadFail(rawpath, ''))
      }
    }
  }
}

/**
 * @template T
 * @param {string} url
 * @param {Parser<T>} parser
 * @returns {Promise<T | undefined>}
 */
async function load(url, parser) {
  const response = await fetch(url)

  if (!response.ok) {
    return undefined
  }

  const resource = await parser.parse(response)

  return resource
}