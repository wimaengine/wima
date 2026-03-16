const lineStyle = new URL('./linestyle.js', import.meta.url)
const arcs = new URL('./arcs.js', import.meta.url)
const shapes = new URL('./shapes.js', import.meta.url)
const grid = new URL('./grid.js', import.meta.url)

export default {
  'arcs': arcs,
  'shapes': shapes,
  'grid': grid,
  'line styles': lineStyle
}
