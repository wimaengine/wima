/**
 * Represents a 4x4 square matrix.
 * Can be used to represent 3 dimensional rotation, scale and skew.
 * 
 * Row major.
 * 
 *  | a | e | i | m |
 *  |---|---|---|---|
 *  | b | f | j | n |
 *  | c | g | k | o |
 *  | d | h | l | p |
 */
export class Matrix4 {

  /**
   * @type {number}
   */
  a = 1

  /**
   * @type {number}
   */
  b = 0

  /**
   * @type {number}
   */
  c = 0

  /**
   * @type {number}
   */
  d = 0

  /**
   * @type {number}
   */
  e = 0

  /**
   * @type {number}
   */
  f = 1

  /**
   * @type {number}
   */
  g = 0

  /**
   * @type {number}
   */
  h = 0

  /**
   * @type {number}
   */
  i = 0

  /**
   * @type {number}
   */
  j = 0

  /**
   * @type {number}
   */
  k = 1

  /**
   * @type {number}
   */
  l = 0

  /**
   * @type {number}
   */
  m = 0

  /**
   * @type {number}
   */
  n = 0

  /**
   * @type {number}
   */
  o = 0

  /**
   * @type {number}
   */
  p = 1

  /**
   * @param {number} n11 
   * @param {number} n12 
   * @param {number} n13 
   * @param {number} n14 
   * @param {number} n21 
   * @param {number} n22 
   * @param {number} n23 
   * @param {number} n24 
   * @param {number} n31 
   * @param {number} n32 
   * @param {number} n33 
   * @param {number} n34 
   * @param {number} n41 
   * @param {number} n42 
   * @param {number} n43 
   * @param {number} n44 
   */
  constructor(
    n11 = 1, 
    n12 = 0, 
    n13 = 0, 
    n14 = 0,
    n21 = 0, 
    n22 = 1, 
    n23 = 0, 
    n24 = 0,
    n31 = 0, 
    n32 = 0, 
    n33 = 1, 
    n34 = 0,
    n41 = 0, 
    n42 = 0, 
    n43 = 0, 
    n44 = 1
  ) {
    Matrix4.set(
      this,
      n11, 
      n12, 
      n13, 
      n14,
      n21, 
      n22, 
      n23, 
      n24,
      n31, 
      n32, 
      n33, 
      n34,
      n41, 
      n42, 
      n43, 
      n44
    )
  }

  /**
   * @returns {this}
   */
  inverse() {
    Matrix4.inverse(this, this)

    return this
  }

  /**
   * @param {Matrix4} m 
   * @returns {this}
   */
  multiply(m) {
    Matrix4.multiply(this, m, this)

    return this
  }

  /**
   * @param {Matrix4} m 
   * @returns {this}
   */
  copy(m) {
    Matrix4.copy(m, this)

    return this
  }
  
  clone() {
    return Matrix4.copy(this)
  }

  static set(
    out,
    n11 = 1, 
    n12 = 0, 
    n13 = 0, 
    n14 = 0,
    n21 = 0, 
    n22 = 1, 
    n23 = 0, 
    n24 = 0,
    n31 = 0, 
    n32 = 0, 
    n33 = 1, 
    n34 = 0,
    n41 = 0, 
    n42 = 0, 
    n43 = 0, 
    n44 = 1
  ) {
    out.a = n11
    out.b = n21
    out.c = n31
    out.d = n41
    out.e = n12
    out.f = n22
    out.g = n32
    out.h = n42
    out.i = n13
    out.j = n23
    out.k = n33
    out.l = n43
    out.m = n14
    out.n = n24
    out.o = n34
    out.p = n44

    return out
  }

  static identity(out = new Matrix4()) {
    Matrix4.set(
      out,
      1, 
      0, 
      0, 
      0,
      0, 
      1, 
      0, 
      0,
      0, 
      0, 
      1, 
      0,
      0, 
      0, 
      0, 
      1
    )

    return out
  }

  static copy(m, out = new Matrix4()) {
    out.a = m.a
    out.b = m.b
    out.c = m.c
    out.d = m.d
    out.e = m.e
    out.f = m.f
    out.g = m.g
    out.h = m.h
    out.i = m.i
    out.j = m.j
    out.k = m.k
    out.l = m.l
    out.m = m.m
    out.n = m.n
    out.o = m.o
    out.p = m.p

    return out
  }

  static multiply(a, b, out = new Matrix4()) {
    const
      a11 = a.a,
      a12 = a.e,
      a13 = a.i,
      a14 = a.m,
      a21 = a.b,
      a22 = a.f,
      a23 = a.j,
      a24 = a.n

    a31 = a.c,
    a32 = a.g,
    a33 = a.k,
    a34 = a.o
    a41 = a.d,
    a42 = a.h,
    a43 = a.l,
    a44 = a.p

    const
      b11 = b.a,
      b12 = b.e,
      b13 = b.i,
      b14 = b.m

    b21 = b.b,
    b22 = b.f,
    b23 = b.j,
    b24 = b.n
    b31 = b.c,
    b32 = b.g,
    b33 = b.k,
    b34 = b.o
    b41 = b.d,
    b42 = b.h,
    b43 = b.l,
    b44 = b.p

    out.a = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41
    out.e = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42
    out.i = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43
    out.m = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44

    out.b = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41
    out.f = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42
    out.j = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43
    out.n = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44

    out.c = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41
    out.g = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42
    out.k = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43
    out.o = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44

    out.d = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41
    out.h = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42
    out.l = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43
    out.p = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44

    return this

  }

  static multiplyScalar(m, s, out = new Matrix4()) {
    out.a = m.a * s
    out.b = m.b * s
    out.c = m.c * s
    out.d = m.d * s
    out.e = m.e * s
    out.f = m.f * s
    out.g = m.g * s
    out.h = m.h * s
    out.i = m.i * s
    out.j = m.j * s
    out.k = m.k * s
    out.l = m.l * s
    out.m = m.m * s
    out.n = m.n * s
    out.o = m.o * s
    out.p = m.p * s

    return out
  }

  static determinant(m) {
    const n11 = m.a,
      n12 = m.e,
      n13 = m.i,
      n14 = m.m

    n21 = m.b,
    n22 = m.f,
    n23 = m.j,
    n24 = m.n
    n31 = m.c,
    n32 = m.g,
    n33 = m.k,
    n34 = m.o
    n41 = m.d,
    n42 = m.h,
    n43 = m.l,
    n44 = m.p

    return (
      n41 * (
        +n14 * n23 * n32 -
        n13 * n24 * n32 -
        n14 * n22 * n33 +
        n12 * n24 * n33 +
        n13 * n22 * n34 -
        n12 * n23 * n34
      ) +
      n42 * (
        +n11 * n23 * n34 -
        n11 * n24 * n33 +
        n14 * n21 * n33 -
        n13 * n21 * n34 +
        n13 * n24 * n31 -
        n14 * n23 * n31
      ) +
      n43 * (
        +n11 * n24 * n32 -
        n11 * n22 * n34 -
        n14 * n21 * n32 +
        n12 * n21 * n34 +
        n14 * n22 * n31 -
        n12 * n24 * n31
      ) +
      n44 * (
        -n13 * n22 * n31 -
        n11 * n23 * n32 +
        n11 * n22 * n33 +
        n13 * n21 * n32 -
        n12 * n21 * n33 +
        n12 * n23 * n31
      )
    )

  }

  static transpose(m, out = new Matrix()) {
    let tmp

    out.a = m.a
    out.f = m.f
    out.k = m.k
    out.p = m.p

    tmp = m.b
    out.b = m.e
    out.e = tmp

    tmp = m.c
    out.c = m.i
    out.i = tmp

    tmp = m.g
    out.g = m.j
    out.j = tmp

    tmp = m.d
    out.d = m.m
    out.m = tmp

    tmp = m.h
    out.h = m.n
    out.n = tmp

    tmp = m.l
    out.l = m.o
    out.o = tmp

    return out
  }

  static inverse(m, out = new Matrix4()) {
    const n11 = m.a,
      n21 = m.b,
      n31 = m.c,
      n41 = m.d,
      n12 = m.e,
      n22 = m.f,
      n32 = m.g,
      n42 = m.h,
      n13 = m.i,
      n23 = m.j,
      n33 = m.k,
      n43 = m.l,
      n14 = m.m,
      n24 = m.n,
      n34 = m.o,
      n44 = m.p,

      t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
      t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
      t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
      t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14

    if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

    const detInv = 1 / det

    out.a = t11 * detInv
    out.b = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv
    out.c = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv
    out.d = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv

    out.e = t12 * detInv
    out.f = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv
    out.g = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv
    out.h = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv

    out.i = t13 * detInv
    out.j = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv
    out.k = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv
    out.l = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv

    out.m = t14 * detInv
    out.n = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv
    out.o = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv
    out.p = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv

    return out
  }
  static equals(a, b) {
    return a === b
  }

  /**
   * Allows iteration of components.
   *
   * @yields {number}
   */
  * [Symbol.iterator]() {
    yield this.a
    yield this.b
    yield this.c
    yield this.d
    yield this.e
    yield this.f
    yield this.g
    yield this.h
    yield this.i
    yield this.j
    yield this.k
    yield this.l
    yield this.m
    yield this.n
    yield this.o
    yield this.p
  }
}