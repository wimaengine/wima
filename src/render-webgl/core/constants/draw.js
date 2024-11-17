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

/**
 * @readonly
 * @enum {number}
 */
export const CullFace = {
  None:0,
  Front: 0x0404,
  Back: 0x0405,
  Both: 0x0408
}

/**
 * @readonly
 * @enum {number}
 */
export const FrontFace = {
  ClockWise: 0x0900,
  CounterClockWise: 0x0901
}

/**
 * @readonly
 * @enum {number}
 */
export const DepthFunc = {
  Never: 0x0200,
  Less: 0x0201,
  Equal: 0x0202,
  LEqual: 0x0203,
  Greater: 0x0204,
  NotEqual: 0x0205,
  GEqual: 0x0206,
  Always: 0x0207
}

/**
 * @readonly
 * @enum {number}
 */
export const StencilOperation = {
  Keep: 0x1E00,
  Replace: 0x1E01,
  Equal: 0x1E02,
  Increase: 0x1E03,
  Decrease: 0x1E04,
  Invert: 0x150A,
  IncreaseWrap: 0x8507,
  DecreaseWrap: 0x8508
}