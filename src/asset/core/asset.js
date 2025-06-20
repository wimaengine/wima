/** @import {AssetId} from '../types/index.js' */

import { DenseList } from '../../datastructures/index.js'
import { assert } from '../../logger/index.js'
import { Handle } from './handle.js'

/**
 * @template T
 */
export class Assets {

  /**
   * @private
   * @type {DenseList<T | undefined>}
   */
  assets = new DenseList()

  /**
   * @private
   * @type {Map<string,number>}
   */
  paths = new Map()

  /**
   * @private
   * @type {string[]}
   */
  toLoad = []

  /**
   * @protected
   * @type {HandleProvider<T>}
   */
  createHandle

  /**
   * @param {(HandleProvider<T>)} handler
   */
  constructor(handler = defaultHandler) {
    this.createHandle = handler
  }

  /**
   * @param {string} name
   * @returns {T | undefined}
   */
  get(name) {
    const id = this.paths.get(name)

    if (id === undefined) return undefined

    return this.assets.get(id)
  }

  /**
   * @param {string} path 
   * @returns {Handle<T> | undefined}
   */
  getHandle(path) {
    const index = this.paths.get(path)

    if (index !== undefined) return this.createHandle(index)

    return undefined
  }

  /**
   * @param {Handle<T>} handle
   * @returns {T}
   */
  getByHandle(handle) {
    const asset = this.assets.get(handle.index)

    assert(asset, 'The handle provided is invalid!Did you try to create your own handle?')

    return asset
  }

  /**
   * @param {AssetId} id
   * @returns {T | undefined}
   */
  getById(id) {
    return this.assets.get(id)
  }

  /**
   * @param {Handle<T>} handle
   * @param {T} asset
   */
  setByHandle(handle, asset) {
    this.assets.set(handle.index, asset)
  }

  /**
   * @param {string} path
   * @param {T} asset
   */
  setByPath(path, asset) {
    const id = this.paths.get(path)

    assert(id, 'The given path has not been loaded')

    this.assets.set(id, asset)
  }

  /**
   * @param {string} path 
   * @param {T} asset 
   * @returns {Handle<T>}
   */
  add(path, asset) {
    const id = this.paths.get(path) || this.assets.reserve()

    this.assets.set(id, asset)
    this.paths.set(path, id)

    return this.createHandle(id)
  }

  /**
   * @param {string} path 
   * @returns {Handle<T>}
   */
  load(path) {
    const id = this.assets.reserve()

    this.assets.set(id, undefined)
    this.paths.set(path, id)
    this.toLoad.push(path)

    return this.createHandle(id)
  }

  /**
   * @returns {Readonly<string[]>}
   */
  flushToLoad() {
    const load = this.toLoad

    if (load.length) this.toLoad = []

    return load
  }
}

/**
 * @template T
 * @param {number} id 
 * @returns {Handle<T>}
 */
function defaultHandler(id) {
  return new Handle(id)
}

/**
 * @template T
 * @callback HandleProvider
 * @param {number} id
 * @returns {Handle<T>}
 */