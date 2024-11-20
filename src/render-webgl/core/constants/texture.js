/**
 * @readonly
 * @enum {number}
 */
export const TextureFormat = {

  // gl.DEPTH_COMPONENT
  Depth: 0x1902, 
  Red: 0x1903,
  Alpha: 0x1906,
  RGB: 0x1907,
  RGBA: 0x1908,
  Luminance: 0x1909,
  LuminanceAlpha: 0x190A,
  RGB8: 0x8051,
  RGBA8: 0x8058,
  RGBA16F: 0x881A,
  RGB16F: 0x881B,
  RGBA32F: 0x8814,
  RGB32F: 0x8815,
  RGBA32I: 0x8D82,
  RGB32I: 0x8D83,
  RGBA16I: 0x8D88,
  RGB16I: 0x8D89,
  RGBA8I: 0x8D8E,
  RGB8I: 0x8D8F
}

/**
 * @readonly
 * @enum {number}
 */
export const TextureFilter = {
  Nearest: 0x2600,
  Linear: 0x2601,
  NEAREST_MIPMAP_NEAREST: 0x2700,
  LINEAR_MIPMAP_NEAREST: 0x2701,
  NEAREST_MIPMAP_LINEAR: 0x2702,
  LINEAR_MIPMAP_LINEAR: 0x2703
}

/**
 * @readonly
 * @enum {number}
 */
export const TextureWrap = {
  Repeat: 0x2901,
  Clamp: 0x812F,
  MirrorRepeat: 0x8370
}