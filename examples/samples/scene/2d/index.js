const basic = new URL('./basic.js', import.meta.url)
const multipleInstances = new URL('./multiple_instances.js', import.meta.url)
const assetLoad = new URL('./load_json.js', import.meta.url)

export default {
  'basic': basic,
  'multiple_instances': multipleInstances,
  'load_json': assetLoad
}
