/**
 * @readonly
 * @enum {number}
 */
export const GlDataType = {
  Byte: 0x1400,
  UnsignedByte: 0x1401,
  Short: 0x1402,
  UnsignedShort: 0x1403,
  Int: 0x1404,
  UnsignedInt: 0x1405,
  Float: 0x1406
}

/**
 * @readonly
 * @enum {number}
 */
export const GlUniformType = {
  Vec2:0x8B50,
  Vec3:0x8B51,
  Vec4:0x8B52,
  Ivec2:0x8B53,
  Ivec3:0x8B54,
  Ivec4:0x8B55,
  Bool:0x8B56,
  Bvec2:0x8B57,
  Bvec3:0x8B58,
  Bvec4:0x8B59,
  Matrix2:0x8B5A,
  Matrix3:0x8B5B,
  Matrix4:0x8B5C,
  Sampler:0x8B5E,
  SamplerCube:0x8B60,
  Matrix2x3: 0x8B65,
  Matrix2x4: 0x8B66,
  Matrix3x2: 0x8B67,
  Matrix3x4: 0x8B68,
  Matrix4x2: 0x8B69,
  Matrix4x3: 0x8B6A,
}

/**
 * @readonly
 * @enum {number}
 */
export const ClearBit = {
  Depth: 0x00000100,
  Stencil: 0x00000400,
  Color: 0x00004000
}

/**
 * Return type of `gl.getError()`.
 * @readonly
 * @enum {number}
 */
export const GLError = {
  None: 0,
  InvalidEnum: 0x0500,
  InvalidValue: 0x0501,
  InvalidOperation: 0x0502,
  OutOfMemory: 0x0505,
  ContextLost: 0x9242
}