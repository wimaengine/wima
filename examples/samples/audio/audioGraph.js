import {
  World,
  AudioAssets,
  AudioGraph,
  Handle,
  Audio,
  AssetServer,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  Plugin
} from 'wima'
import { HackPlugin, setupViewport } from '../utils.js'

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

// Why use a plugin? The current implentation does not have system sets and
// systems registered directly on the App are precede ones registered by plugins.
// This conflict is between internal engine system and external engine systems ordering.
class MyPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem(AppSchedule.Startup, init)
  }
}
const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerPlugin(new MyPlugin())
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerSystem(AppSchedule.Update, playAudio)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const server = world.getResource(AssetServer)
  const handle = server.load(Audio, '/audio/hit.mp3')

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
