export class Vector4 {

  /**
   * @type {number}
   */
  x

  /**
   * @type {number}
   */
  y

  /**
   * @type {number}
   */
  z

  /**
   * @type {number}
   */
  w

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {number} w 
   */
  constructor( x = 0, y = 0, z = 0, w = 0 ) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  set(x, y, z, w){
    Vector4.set(this, x, y, z, w)
  }

  /**
   * @param {Vector4} v
   */
  copy(v){
    Vector4.copy(v, this)

    return this
  }

  clone(){
    return Vector4.copy(this)
  }

  /**
   * @param {number} s
   */
  splat(s){
    Vector4.splat(s, this)

    return this
  }

  /**
   * @param {Vector4} v
   */
  add(v){
    Vector4.add(this, v, this)

    return this
  }

  /**
   * @param {number} s
   */
  addScalar(s){
    Vector4.addScalar(this, s, this)

    return this
  }

  /**
   * @param {Vector4} v
   */
  sub(v){
    Vector4.sub(this, v, this)

    return this
  }

  /**
   * @param {number} s
   */
  subScalar(s){
    Vector4.subScalar(this, s, this)

    return this
  }

  /**
   * @param {Vector4} v
   */
  multiply(v){
    Vector4.multiply(this, v, this)

    return this
  }

  /**
   * @param {number} s
   */
  multiplyScalar(s){
    Vector4.multiplyScalar(this, s, this)

    return this
  }

  /**
   * @param {Vector4} v
   */
  divide(v){
    Vector4.divide(this, v, this)

    return this
  }

  /**
   * @param {number} s
   */
  divideScalar(s){
    Vector4.divideScalar(this, s, this)

    return this
  }

  /** */
  magnitude(){
    return Vector4.magnitude(this)
  }

  /** */
  magnitudeSquared(){
    return Vector4.magnitudeSquared(this)
  }

  /**
   * @param {Vector4} v
   */
  dot(v){
    return Vector4.dot(this, v)
  }

  /** */
  reverse(){
    Vector4.reverse(this, this)

    return this
  }

  /** */
  normalize(){
    Vector4.normalize(this, this)

    return this
  }

  /**
   * @param {Vector4} v
   */
  equals(v){
    return Vector4.equals(this, v)
  }

  /**
   * @param {Vector4} v
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  static set(v, x, y, z, w ) {
    v.x = x
    v.y = y
    v.z = z
    v.w = w

    return v

  }

  /**
   * @param {number} scalar
   * @param {Vector4} out
   */
  static splat( scalar, out = new Vector4() ) {
    out.x = scalar
    out.y = scalar
    out.z = scalar
    out.w = scalar

    return out
  }

  /**
   * @param {Vector4} v
   * @param {Vector4} out
   */
  static copy( v, out = new Vector4() ) {
    out.x = v.x
    out.y = v.y
    out.z = v.z
    out.w = v.w

    return out
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out 
   */
  static add(a, b, out = new Vector4()) {
    out.x = a.x + b.x
    out.y = a.y + b.y
    out.z = a.z + b.z
    out.w = a.w + b.w

    return out

  }

  /**
   * @param {Vector4} v 
   * @param {number} s 
   * @param {Vector4} out 
   */
  static addScalar(v, s, out = new Vector4() ) {

    out.x = v.x + s
    out.y = v.y + s
    out.z = v.z + s
    out.w = v.w + s

    return out
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out
   */
  static sub( a, b, out = new Vector4() ) {
    out.x = a.x - b.x
    out.y = a.y - b.y
    out.z = a.z - b.z
    out.w = a.w - b.w

    return out
  }

  /**
   * @param {Vector4} v 
   * @param {number} s 
   * @param {Vector4} out 
   */
  static subScalar( v, s, out = new Vector4() ) {
    out.x = v.x - s
    out.y = v.y - s
    out.z = v.z - s
    out.w = v.w - s

    return out
  }

  /** 
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out
   */
  static multiply( a, b, out = new Vector4() ) {
    out.x = a.x * b.x
    out.y = a.y * b.y
    out.z = a.z * b.z
    out.w = a.w * b.w

    return out
  }

  /**
   * @param {Vector4} v 
   * @param {number} s 
   * @param {Vector4} out 
   */
  static multiplyScalar( v, s, out = new Vector4() ) {
    out.x = v.x * s
    out.y = v.y * s
    out.z = v.z * s
    out.w = v.w * s

    return out
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out
   */
  static divide( a, b, out = new Vector4() ) {
    out.x = a.x / b.x
    out.y = a.y / b.y
    out.z = a.z / b.z
    out.w = a.w / b.w

    return out
  }

  /**
   * @param {Vector4} v
   * @param {number} scalar
   * @param {Vector4} out
   */
  static divideScalar(v, scalar, out = new Vector4() ) {
    return Vector4.multiplyScalar(v, 1 / scalar, out)
  }

  /**
   * @param {Vector4} v 
   * @param {Vector4} out 
   */
  static reverse(v, out = new Vector4()) {
    out.x = -v.x
    out.y = -v.y
    out.z = -v.z
    out.w = -v.w

    return out
  }

  /**
   * @param {Vector4} a 
   * @param {Vector4} b 
   * @returns 
   */
  static dot( a, b ) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
  }

  /**
   * @param {Vector4} v
   */
  static magnitudeSquared(v) {
    return v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w
  }

  /**
   * @param {Vector4} v 
   */
  static magnitude(v) {
    return Math.sqrt( Vector4.magnitudeSquared(v))
  }
	
  /**
   * @param {Vector4} v 
   * @param {Vector4} out 
   */
  static normalize(v, out = new Vector4()) {
    const length = Vector4.magnitude(v) || 1

    return Vector4.divideScalar(v, length, out )
  }

  /**
   * @param {Vector4} v1
   * @param {Vector4} v2
   * @param {number} t
   * @param {Vector4} out
   */
  static lerp( v1, v2, t, out = new Vector4() ) {
    out.x = v1.x + ( v2.x - v1.x ) * t
    out.y = v1.y + ( v2.y - v1.y ) * t
    out.z = v1.z + ( v2.z - v1.z ) * t
    out.w = v1.w + ( v2.w - v1.w ) * t

    return out
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   */
  static equals( a, b ) {
    return ( 
      ( a.x === b.x ) && 
      ( a.y === b.y ) && 
      ( a.z === b.z ) &&
      ( a.w === b.w )
    )
  }
	
  static random(out = new Vector4()) {
    out.x = Math.random()
    out.y = Math.random()
    out.z = Math.random()
    out.w = Math.random()

    return out
  }

  /**
   * @yields {number}
   */
  * [Symbol.iterator]() {
    yield this.x
    yield this.y
    yield this.z
    yield this.w
  }
  
  /**
   * A vector whose components values will remain 0.
   *
   * @readonly
   * @type {Vector4}
   */
  static ZERO = new Vector4()
}