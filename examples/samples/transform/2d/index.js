const translate2d = new URL('./translate.js', import.meta.url)
const rotate2d = new URL('./rotate.js', import.meta.url)
const scale2d = new URL('./scale.js', import.meta.url)
const propagate2d = new URL('./propagate.js', import.meta.url)
const lookat2d = new URL('./lookat.js', import.meta.url)

export default {
  'translate2d': translate2d,
  'rotate2d': rotate2d,
  'scale2d': scale2d,
  'propagate2d': propagate2d,
  'lookat2d': lookat2d
}
