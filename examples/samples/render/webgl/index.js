const basictriangle = new URL('./basictriangle.js', import.meta.url)
const colorchangetriangle = new URL('./colorchangetriangle.js', import.meta.url)
const geometries = new URL('./geometries.js', import.meta.url)
const camerarotate = new URL('./camerarotate.js', import.meta.url)
const cameraperspective = new URL('./cameraperspective.js', import.meta.url)
const cameraorthographic = new URL('./cameraorthographic.js', import.meta.url)

export default {
  'basictriangle': basictriangle,
  'colorchangetriangle': colorchangetriangle,
  'geometries': geometries,
  'camerarotate': camerarotate,
  'cameraperspective': cameraperspective,
  'cameraorthographic': cameraorthographic
}
