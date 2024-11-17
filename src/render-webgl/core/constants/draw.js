/**
 * @readonly
 * @enum {number}
 */
export const DrawPrimitive = {
  Points: 0x0000,
  Lines: 0x0001,
  LineLoop: 0x0002,
  LineStrip: 0x0003,
  Triangles: 0x0004,
  TriangleStrip: 0x0005,
  TriangleFan: 0x0006
}

/**
 * @readonly
 * @enum {number}
 */
export const DrawUsage = {
  Static: 0x88E4,
  Dynamic: 0x88E8,
  Stream: 0x88E0
}