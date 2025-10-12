import {
  Demo,
  World,
  AudioAssets,
  AudioGraph,
  Handle,
  Audio,
  AssetServer
} from 'wima'
import { addDefaultCamera3D } from '../utils.js'

export default new Demo(
  'audio/graph',
  [init, addDefaultCamera3D],
  [playAudio]
)
class Playing {
  handle

  /**
   * @type {number?}
   */
  value

  /**
   * @param {Handle<Audio>} handle
   */
  constructor(handle) {
    this.handle = handle
  }
}

/**
 * @param {World} world
 */
function init(world) {
  const server = world.getResource(AssetServer)
  const handle = server.load(Audio, 'assets/audio/hit.mp3')

  world.setResource(new Playing(handle))
}

/**
 * @param {World} world
 */
function playAudio(world) {
  const current = world.getResource(Playing)
  const audioGraph = world.getResource(AudioGraph)
  const audioSources = world.getResource(AudioAssets)
  const audioSource = audioSources.get(current.handle)

  if (current.value || !audioSource) {
    return
  }

  const ctx = audioGraph.getContext()
  const source = new AudioBufferSourceNode(ctx, {
    buffer: audioSource.audiobuffer,
    loop: true
  })
  const sourceId = audioGraph.add(source)

  audioGraph.connect(sourceId, audioGraph.getRoot())
  source.start()
  current.value = sourceId
}
