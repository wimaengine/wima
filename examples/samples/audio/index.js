const audioGraph = new URL('./audioGraph.js', import.meta.url)
const audioPlayer = new URL('./audioPlayer.js', import.meta.url)
const audioPlayback = new URL('./audioPlayback.js', import.meta.url)
const audioOscillator = new URL('./audioOscillator.js', import.meta.url)

export default {
  'audioGraph': audioGraph,
  'audioPlayer': audioPlayer,
  'audioPlayback': audioPlayback,
  'audioOscillator': audioOscillator
}
