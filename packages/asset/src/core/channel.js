/** @import { AssetId } from '../types' */

/**
 * @readonly
 * @enum {number}
 */
export const AssetChannelMessageType = {
  Acquire: 0,
  Release: 1
}

/**
 * @template T
 */
export class AssetChannel {

  /**
   * @private
   * @type {AssetChannelMessage<T>[]}
   */
  queue = []

  /**
   * Queue a reference acquisition.
   *
   * @param {AssetId} assetId
   */
  acquire(assetId) {
    this.queue.push(new AssetChannelMessage(AssetChannelMessageType.Acquire, assetId))
  }

  /**
   * Queue a reference release.
   *
   * @param {AssetId} assetId
   */
  release(assetId) {
    this.queue.push(new AssetChannelMessage(AssetChannelMessageType.Release, assetId))
  }

  /**
   * Drain the queued messages.
   *
   * @returns {Readonly<AssetChannelMessage<T>[]>}
   */
  flush() {
    const { queue } = this

    if (queue.length) this.queue = []

    return queue
  }
}

/**
 * @template T
 */
export class AssetChannelMessage {

  /**
   * @readonly
   * @type {AssetChannelMessageType}
   */
  type

  /**
   * @readonly
   * @type {AssetId}
   */
  assetId

  /**
   * @param {AssetChannelMessageType} type
   * @param {AssetId} assetId
   */
  constructor(type, assetId) {
    this.type = type
    this.assetId = assetId
  }
}
