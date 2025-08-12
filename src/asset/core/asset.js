/** @import {AssetId} from '../types/index.js' */
/** @import {Constructor} from '../../reflect/index.js'*/
import { DenseList } from '../../datastructures/index.js'
import { AssetAdded, AssetDropped, AssetEvent, AssetModified } from '../events/assets.js'

/**
 * @template T
 */
export class Assets {

  /**
   * @type {Constructor<T>}
   */
  type

  /**
   * @private
   * @type {DenseList<AssetEntry<T>>}
   */
  assets = new DenseList()

  /**
   * @private
   * @type {Map<string,Handle<T>>}
   */
  uuids = new Map()

  // TODO: Move to asset server when it is implemented
  /**
   * @private
   * @type {string[]}
   */
  toLoad = []

  /**
   * @private
   * @type {AssetEvent<T>[]}
   */
  events = []

  /**
   * @param {Constructor<T>} type
   */
  constructor(type) {
    this.type = type
  }

  /**
   * @param {T} asset 
   * @returns {Handle<T>}
   */
  add(asset) {
    const id = this.assets.reserve()

    this.assets.set(id, new AssetEntry(asset))

    const handle = new Handle(this, id)

    this.events.push(new AssetAdded(this.type, handle.id()))

    return handle
  }

  /**
   * @param {Handle<T>} handle
   * @param {T} asset
   */
  set(handle, asset) {
    const entry = this.getEntry(handle)

    if(!entry) return

    const oldAsset = entry.asset

    entry.asset = asset

    if (oldAsset) {
      this.events.push(new AssetModified(this.type, handle.id()))
    } else {
      this.events.push(new AssetAdded(this.type, handle.id()))
    }
  }

  /**
   * @param {string} uuid 
   * @param {T} asset 
   * @returns {Handle<T>}
   */
  setWithUUID(uuid, asset) {
    const handle = this.uuids.get(uuid)

    if (handle) {
      this.set(handle, asset)

      // TODO: clone this when asset dropping is added
      return handle
    }

    const newHandle = this.add(asset)

    // TODO: clone this when asset dropping is added
    this.uuids.set(uuid, newHandle)

    return newHandle
  }

  /**
   * @param {Handle<T>} handle
   * @returns {AssetEntry<T> | undefined}
   */
  getEntry(handle) {
    const { index } = handle

    return this.assets.get(index)
  }

  /**
   * @param {Handle<T>} handle
   * @returns {T | undefined}
   */
  get(handle) {
    const entry = this.getEntry(handle)

    if(!entry) return undefined

    return entry.asset
  }

  /**
   * @param {string} uuid
   * @returns {T | undefined}
   */
  getByUUID(uuid) {
    const handle = this.getHandleByUUID(uuid)

    if (!handle) return undefined

    return this.get(handle)
  }

  /**
   * @param {AssetId} id
   * @returns {T | undefined}
   */
  getByAssetId(id) {
    const entry = this.assets.get(id)

    if(!entry) return undefined

    return this.assets.get(id).asset
  }

  /**
   * @param {string} uuid 
   * @returns {Handle<T> | undefined}
   */
  getHandleByUUID(uuid) {

    // TODO: clone this when asset dropping is added
    return this.uuids.get(uuid)
  }

  // TODO: Move to asset server when it is implemented
  /**
   * @param {string} path 
   * @returns {Handle<T>}
   */
  load(path) {
    const id = this.assets.reserve()

    this.assets.set(id, new AssetEntry(undefined))
    this.uuids.set(path, new Handle(this, id))
    this.toLoad.push(path)

    return new Handle(this, id)
  }

  // TODO: Move to asset server when it is implemented
  /**
   * @returns {Readonly<string[]>}
   */
  flushToLoad() {
    const load = this.toLoad

    if (load.length) this.toLoad = []

    return load
  }

  /**
   * @returns {Readonly<AssetEvent<T>[]>}
   */
  flushEvents() {
    const { events } = this

    if (events.length) this.events = []

    return events
  }

  /**
   * @param {Handle<T>} handle
   */
  drop(handle){
    const entry = this.getEntry(handle)
    
    entry.refCount -= 1

    if(entry.refCount <= 0){
      entry.asset = undefined
      this.assets.recycle(handle.index)
      this.events.push(new AssetDropped(this.type, handle.id()))
    }
  }
}

/**
 * @template T
 */
export class Handle {

  /**
   * This only exists as a channel for reference counting, do not use for any
   * other purpose!
   * @private
   * @readonly
   * @type {Assets<T>}
   */
  assets

  /**
   * @readonly
   * @type {number}
   */
  index

  /**
   * @param {Assets<T>} assets 
   * @param {number} index 
   */
  constructor(assets, index){
    this.index = index
    this.assets = assets

    const entry = assets.getEntry(this)

    if(entry){
      entry.refCount += 1
    }
  }

  /**
   * @returns {AssetId}
   */
  id(){
    return /** @type {AssetId}*/(this.index)
  }

  clone(){
    const { assets, index } = this

    return new Handle(assets, index)
  }

  drop(){
    this.assets.drop(this)
  }
}

/**
 * @template T
 */
export class AssetEntry {

  /**
   * @type {T | undefined}
   */
  asset

  /**
   * @type {number}
   */
  refCount

  /**
   * @param {T} asset
   */
  constructor(asset) {
    this.asset = asset
    this.refCount = 0
  }
}

/**
 * @template T
 * @callback HandleProvider
 * @param {number} id
 * @returns {Handle<T>}
 */