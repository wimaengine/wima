const translate3d = new URL('./translate.js', import.meta.url)
const rotate3d = new URL('./rotate.js', import.meta.url)
const scale3d = new URL('./scale.js', import.meta.url)
const lookAt3d = new URL('./lookat.js', import.meta.url)
const propagate3d = new URL('./propagate.js', import.meta.url)

export default {
  'translate3d': translate3d,
  'rotate3d': rotate3d,
  'scale3d': scale3d,
  'lookAt3d': lookAt3d,
  'propagate3d': propagate3d
}
