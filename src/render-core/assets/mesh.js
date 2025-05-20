import { Vector2, Vector3 } from '../../math/index.js'
import { GlDataType } from '../../render-webgl/index.js'
import { AttributeLocation } from '../core/atributelocation.js'
import { Attribute } from '../core/attribute.js'

/** */
export class Mesh {

  /**
   * @private
   * @type {Uint16Array | undefined}
   */
  indices

  /**
   * @private
   * @type {Map<string,Attribute>}
   */
  attributes = new Map()

  /**
   * @returns {Uint16Array | undefined}
   */
  getIndices() {
    return this.indices
  }

  /**
   * @param {Uint16Array | undefined} indices
   */
  setIndices(indices) {
    this.indices = indices

    return this
  }

  /**
   * @param {string} name
   * @returns {Attribute | undefined} 
   */
  getAttribute(name) {
    return this.attributes.get(name)
  }

  /**
   * @param {string} name
   * @param {Attribute} attribute
   */
  setAttribute(name, attribute) {
    this.attributes.set(name, attribute)

    return this
  }

  /**
   * @returns {Readonly<Map<string,Attribute>>}
   */
  getAttributes() {
    return this.attributes
  }

  /**
   * @param {string} name 
   */
  deleteAttribute(name) {
    this.attributes.delete(name)
  }

  /**
   * @param {number} width
   * @param {number} height
   * @returns {Mesh}
   */
  static quad2D(width, height) {
    const geometry = new Mesh()
    const positions = new Float32Array([
      -width / 2,
      -height / 2,
      -width / 2,
      height / 2,
      width / 2,
      height / 2,
      width / 2,
      -height / 2
    ])

    geometry.setAttribute('position2d', new Attribute(positions))

    return geometry
  }

  /**
   * @param {number} radius
   * @param {number} resolution
   * @returns {Mesh}
   */
  static circle2D(radius, resolution = 16) {
    const geometry = new Mesh()
    const positions = [0, 0]

    const spacing = Math.PI * 2 / resolution

    for (let i = 0; i <= resolution; i++) {
      const position = Vector2.fromAngle(spacing * i)

      Vector2.multiplyScalar(position, radius, position)

      positions.push(position.x, position.y)
    }
    
    geometry
      .setAttribute('position2d', new Attribute(new Float32Array(positions)))

    return geometry
  }

  /**
   * @param {number} base
   * @param {number} height
   * @param {number} angle
   * @returns {Mesh}
   */
  static triangle2D(base, height, angle = Math.asin(height / base)) {
    const geometry = new Mesh()
    const l1 = new Vector2(base)
    const l2 = Vector2.fromAngle(angle)

    Vector2.multiplyScalar(l2, -height / Math.sin(angle), l2)
    const x = -(l1.x + l2.x) / 3
    const y = -l2.y / 3
    const positions = new Float32Array([
      x,
      y,
      l1.x + x,
      l1.y + y,
      l2.x + x,
      l2.y + y
    ])

    geometry.setAttribute('position2d', new Attribute(positions))

    return geometry
  }

  static triangle3D(base = 1, height = 1, baseL = 0) {
    const mesh = new Mesh()

    mesh
      .setIndices(new Uint16Array([0, 1, 2]))
      .setAttribute('position3d', new Attribute(new Float32Array([
        -base / 2,
        -height / 2,
        0,
        +base / 2,
        -height / 2,
        0,
        base / 2 * baseL,
        height / 2,
        0
      ])))

    return mesh
  }

  static circle3D(radius = 0.5, segments = 32, arcstart = 0, arclength = Math.PI * 2) {
    const mesh = new Mesh()
    const vertices = [0, 0, 0]
    const normals = [0, 0, 1]
    const uvs = [0.5, 0.5]
    const indices = []
    const angleIncrement = arclength / segments
    const epilson = Math.pow(2, -31)

    for (let i = arcstart; i < arclength + epilson; i += angleIncrement) {
      const cos = Math.cos(i)
      const sin = Math.sin(i)

      vertices.push(
        radius * cos,
        radius * sin,
        0
      )
      normals.push(0, 0, 1)
      uvs.push((cos + 1) * 0.5, (sin + 1) * 0.5)
    }

    for (let i = 2; i < vertices.length / 3; i++) {
      indices.push(i - 1, i, 0)
    }

    mesh
      .setIndices(
        new Uint16Array(indices)
      )
      .setAttribute(
        'position3d',
        new Attribute(new Float32Array(vertices))
      )
      .setAttribute(
        'normal3d',
        new Attribute(new Float32Array(normals))
      )
      .setAttribute(
        'uv',
        new Attribute(new Float32Array(uvs))
      )

    return mesh
  }

  static plane3D(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    const mesh = new Mesh()
    const widthHalf = width / 2
    const heightHalf = height / 2

    const gridX = Math.floor(widthSegments)
    const gridY = Math.floor(heightSegments)

    const gridX1 = gridX + 1
    const gridY1 = gridY + 1

    const segmentWidth = width / gridX
    const segmentHeight = height / gridY

    //

    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segmentHeight - heightHalf

      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segmentWidth - widthHalf

        vertices.push(x, -y, 0)
        normals.push(0, 0, 1)
        uvs.push(ix / gridX)
        uvs.push(1 - (iy / gridY))

      }

    }

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy
        const b = ix + gridX1 * (iy + 1)
        const c = (ix + 1) + gridX1 * (iy + 1)
        const d = (ix + 1) + gridX1 * iy

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new Attribute(new Float32Array(vertices)))
      .setAttribute('normal3d', new Attribute(new Float32Array(normals)))
      .setAttribute('uv', new Attribute(new Float32Array(uvs)))

    return mesh
  }

  static ring3D(innerRadius = 0.25, outerRadius = 0.5, thetaSegments = 32, phiSegments = 1, thetaStart = 0, thetaLength = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    let radius = innerRadius
    const radiusStep = ((outerRadius - innerRadius) / phiSegments)
    const vertex = new Vector3()
    const uv = new Vector2()

    for (let j = 0; j <= phiSegments; j++) {
      for (let i = 0; i <= thetaSegments; i++) {

        const segment = thetaStart + i / thetaSegments * thetaLength

        vertex.x = radius * Math.cos(segment)
        vertex.y = radius * Math.sin(segment)

        vertices.push(vertex.x, vertex.y, vertex.z)

        normals.push(0, 0, 1)

        uv.x = (vertex.x / outerRadius + 1) / 2
        uv.y = (vertex.y / outerRadius + 1) / 2

        uvs.push(uv.x, uv.y)
      }

      radius += radiusStep
    }

    for (let j = 0; j < phiSegments; j++) {
      const thetaSegmentLevel = j * (thetaSegments + 1)

      for (let i = 0; i < thetaSegments; i++) {
        const segment = i + thetaSegmentLevel
        const a = segment
        const b = segment + thetaSegments + 1
        const c = segment + thetaSegments + 2
        const d = segment + 1

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new Attribute(new Float32Array(vertices)))
      .setAttribute('normal3d', new Attribute(new Float32Array(normals)))
      .setAttribute('uv', new Attribute(new Float32Array(uvs)))

    return mesh
  }

  static lathe3D(points = [new Vector2(0, -0.5), new Vector2(0.5, 0), new Vector2(0, 0.5)], segments = 12, phiStart = 0, phiLength = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const uvs = []
    const initNormals = []
    const normals = []

    const inverseSegments = 1.0 / segments
    const vertex = new Vector3()
    const uv = new Vector2()
    const normal = new Vector3()
    const curNormal = new Vector3()
    const prevNormal = new Vector3()
    let dx
    let dy

    for (let j = 0; j <= (points.length - 1); j++) {
      switch (j) {

        // special handling for 1st vertex on path
        case 0: 
          dx = points[j + 1].x - points[j].x
          dy = points[j + 1].y - points[j].y

          normal.x = dy * 1.0
          normal.y = -dx
          normal.z = dy * 0.0

          prevNormal.copy(normal)

          normal.normalize()

          initNormals.push(normal.x, normal.y, normal.z)

          break

          // special handling for last Vertex on path
        case (points.length - 1): 

          initNormals.push(prevNormal.x, prevNormal.y, prevNormal.z)

          break

        // default handling for all vertices in between
        default: 

          dx = points[j + 1].x - points[j].x
          dy = points[j + 1].y - points[j].y

          normal.x = dy * 1.0
          normal.y = -dx
          normal.z = dy * 0.0

          curNormal.copy(normal)

          normal.x += prevNormal.x
          normal.y += prevNormal.y
          normal.z += prevNormal.z

          normal.normalize()

          initNormals.push(normal.x, normal.y, normal.z)

          prevNormal.copy(curNormal)

      }

    }

    for (let i = 0; i <= segments; i++) {
      const phi = phiStart + i * inverseSegments * phiLength

      const sin = Math.sin(phi)
      const cos = Math.cos(phi)

      for (let j = 0; j <= (points.length - 1); j++) {
        vertex.x = points[j].x * sin
        vertex.y = points[j].y
        vertex.z = points[j].x * cos

        vertices.push(vertex.x, vertex.y, vertex.z)

        uv.x = i / segments
        uv.y = j / (points.length - 1)

        uvs.push(uv.x, uv.y)

        const x = initNormals[3 * j + 0] * sin
        const y = initNormals[3 * j + 1]
        const z = initNormals[3 * j + 0] * cos

        normals.push(x, y, z)

      }

    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < (points.length - 1); j++) {
        const base = j + i * points.length

        const a = base
        const b = base + points.length
        const c = base + points.length + 1
        const d = base + 1

        indices.push(a, b, d)
        indices.push(c, d, b)
      }

    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new Attribute(new Float32Array(vertices)))
      .setAttribute('normal3d', new Attribute(new Float32Array(normals)))
      .setAttribute('uv', new Attribute(new Float32Array(uvs)))

    return mesh
  }

  static cube(width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
    const mesh = new Mesh()

    // SAFETY:We already know they number arrays.
    // @ts-ignore
    const indices = [],

      // @ts-ignore
      vertices = [],

      // @ts-ignore

      normals = [], 

      // @ts-ignore
      uvs = []

    let numberOfVertices = 0

    // px
    buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments)

    // nx
    buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments) 

    // py
    buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments) 

    // ny
    buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments)

    // pz
    buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments) 

    // nz
    buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments) 

    // SAFETY: Already guaranteed arrays contain number type.
    mesh

      // @ts-ignore
      .setIndices(new Uint16Array(indices))

      // @ts-ignore
      .setAttribute('position3d', new Attribute(new Float32Array(vertices)))

      // @ts-ignore
      .setAttribute('normal3d', new Attribute(new Float32Array(normals)))

      // @ts-ignore
      .setAttribute('uv', new Attribute(new Float32Array(uvs)))

    /**
     * @param {string} u
     * @param {string} v
     * @param {string} w
     * @param {number}udir
     * @param {number}vdir
     * @param {number}width
     * @param {number}height
     * @param {number}depth
     * @param {number}gridX
     * @param {number} gridY
     */
    function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY) {
      const segmentWidth = width / gridX
      const segmentHeight = height / gridY

      const widthHalf = width / 2
      const heightHalf = height / 2
      const depthHalf = depth / 2

      const gridX1 = gridX + 1
      const gridY1 = gridY + 1

      let vertexCounter = 0

      const vector = new Vector3()

      for (let iy = 0; iy < gridY1; iy++) {
        const y = iy * segmentHeight - heightHalf

        for (let ix = 0; ix < gridX1; ix++) {
          const x = ix * segmentWidth - widthHalf

          // SAFETY: only used in `Mesh.cube()`,should be fine
          // @ts-ignore
          vector[u] = x * udir

          // @ts-ignore
          vector[v] = y * vdir

          // @ts-ignore
          vector[w] = depthHalf

          vertices.push(vector.x, vector.y, vector.z)

          // SAFETY: only used in `Mesh.cube()`,should be fine
          // @ts-ignore
          vector[u] = 0

          // @ts-ignore
          vector[v] = 0

          // @ts-ignore
          vector[w] = depth > 0 ? 1 : -1

          normals.push(vector.x, vector.y, vector.z)

          uvs.push(ix / gridX)
          uvs.push(1 - (iy / gridY))

          vertexCounter += 1
        }
      }

      for (let iy = 0; iy < gridY; iy++) {
        for (let ix = 0; ix < gridX; ix++) {

          const a = numberOfVertices + ix + gridX1 * iy
          const b = numberOfVertices + ix + gridX1 * (iy + 1)
          const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1)
          const d = numberOfVertices + (ix + 1) + gridX1 * iy

          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }

      numberOfVertices += vertexCounter
    }

    return mesh
  }

  static uvSphere(radius = 0.5, widthSegments = 32, heightSegments = 16, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {
    const mesh = new Mesh()
    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI)
    let index = 0
    const grid = []
    const vertex = new Vector3()
    const normal = new Vector3()

    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = []
      const v = iy / heightSegments
      let uOffset = 0

      if (iy === 0 && thetaStart === 0) {
        uOffset = 0.5 / widthSegments
      } else if (iy === heightSegments && thetaEnd === Math.PI) {
        uOffset = -0.5 / widthSegments
      }

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments

        vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength)
        vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)

        vertices.push(vertex.x, vertex.y, vertex.z)

        normal.copy(vertex).normalize()
        normals.push(normal.x, normal.y, normal.z)

        uvs.push(u + uOffset, 1 - v)
        verticesRow.push(index += 1)
      }

      grid.push(verticesRow)
    }

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1]
        const b = grid[iy][ix]
        const c = grid[iy + 1][ix]
        const d = grid[iy + 1][ix + 1]

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d)
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d)
      }

    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new Attribute(new Float32Array(vertices)))
      .setAttribute('normal3d', new Attribute(new Float32Array(normals)))
      .setAttribute('uv', new Attribute(new Float32Array(uvs)))

    return mesh

  }

  static torus(radius = 0.375, tube = 0.125, radialSegments = 12, tubularSegments = 48, arc = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    const center = new Vector3()
    const vertex = new Vector3()
    const normal = new Vector3()

    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments * arc
        const v = j / radialSegments * Math.PI * 2

        vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u)
        vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u)
        vertex.z = tube * Math.sin(v)

        vertices.push(vertex.x, vertex.y, vertex.z)

        center.x = radius * Math.cos(u)
        center.y = radius * Math.sin(u)

        Vector3.sub(vertex, center, normal).normalize()

        normals.push(normal.x, normal.y, normal.z)

        uvs.push(i / tubularSegments)
        uvs.push(j / radialSegments)
      }
    }

    for (let j = 1; j <= radialSegments; j++) {

      for (let i = 1; i <= tubularSegments; i++) {
        const a = (tubularSegments + 1) * j + i - 1
        const b = (tubularSegments + 1) * (j - 1) + i - 1
        const c = (tubularSegments + 1) * (j - 1) + i
        const d = (tubularSegments + 1) * j + i

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new Attribute(new Float32Array(vertices)))
      .setAttribute('normal3d', new Attribute(new Float32Array(normals)))
      .setAttribute('uv', new Attribute(new Float32Array(uvs)))

    return mesh

  }

  static cylinder(radiusTop = 0.5, radiusBottom = 0.5, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false, thetaStart = 0, thetaLength = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const normals = []
    const uvs = []
    const indexArray = []

    let offset = 0
    const halfHeight = height / 2

    const normal = new Vector3()
    const slope = (radiusBottom - radiusTop) / height

    for (let y = 0; y <= heightSegments; y++) {
      const indexRow = []
      const v = y / heightSegments
      const radius = v * (radiusBottom - radiusTop) + radiusTop

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments
        const theta = u * thetaLength + thetaStart
        const sinTheta = Math.sin(theta)
        const cosTheta = Math.cos(theta)

        vertices.push(
          radius * sinTheta,
          -v * height + halfHeight,
          radius * cosTheta
        )
        normal.set(sinTheta, slope, cosTheta).normalize()
        normals.push(normal.x, normal.y, normal.z)
        uvs.push(u, 1 - v)
        indexRow.push(offset += 1)
      }

      indexArray.push(indexRow)
    }

    for (let x = 0; x < radialSegments; x++) {
      for (let y = 0; y < heightSegments; y++) {
        const a = indexArray[y][x]
        const b = indexArray[y + 1][x]
        const c = indexArray[y + 1][x + 1]
        const d = indexArray[y][x + 1]

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    if (openEnded === false) {

      if (radiusTop > 0) generateCap(true)
      if (radiusBottom > 0) generateCap(false)

    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new Attribute(new Float32Array(vertices)))
      .setAttribute('normal3d', new Attribute(new Float32Array(normals)))
      .setAttribute('uv', new Attribute(new Float32Array(uvs)))

    /**
     * @param {boolean} top
     */
    function generateCap(top) {
      const centerIndexStart = offset

      const uv = new Vector2()
      const vertex = new Vector3()
      const radius = (top === true) ? radiusTop : radiusBottom
      const sign = (top === true) ? 1 : -1

      for (let x = 1; x <= radialSegments; x++) {
        vertices.push(0, halfHeight * sign, 0)
        normals.push(0, sign, 0)
        uvs.push(0.5, 0.5)
        offset += 1
      }

      const centerIndexEnd = offset

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments
        const theta = u * thetaLength + thetaStart
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)

        vertex.x = radius * sinTheta
        vertex.y = halfHeight * sign
        vertex.z = radius * cosTheta
        vertices.push(vertex.x, vertex.y, vertex.z)
        normals.push(0, sign, 0)
        uv.x = (cosTheta * 0.5) + 0.5
        uv.y = (sinTheta * 0.5 * sign) + 0.5
        uvs.push(uv.x, uv.y)
        offset += 1
      }

      for (let x = 0; x < radialSegments; x++) {
        const c = centerIndexStart + x
        const i = centerIndexEnd + x

        if (top === true) {
          indices.push(i, i + 1, c)
        } else {
          indices.push(i + 1, i, c)
        }
      }
    }

    return mesh
  }

  static cone(radius = 0.5, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false, thetaStart = 0, thetaLength = Math.PI * 2) {

    return Mesh.cylinder(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  }
  
  static default() {
    return new Mesh()
  }

  static UVLocation = new AttributeLocation(
    'uv',
    2,
    GlDataType.Float,
    2
  )
  static UVBLocation = new AttributeLocation(
    'uvb',
    3,
    GlDataType.Float,
    2
  )
  static Normal2DLocation = new AttributeLocation(
    'normal2d',
    4,
    GlDataType.Float,
    2
  )
  static Normal3DLocation = new AttributeLocation(
    'normal3d',
    5,
    GlDataType.Float,
    3
  )
  static Tangent2DLocation = new AttributeLocation(
    'tangent2d',
    6,
    GlDataType.Float,
    2
  )
  static Tangent3DLocation = new AttributeLocation(
    'tangent3d',
    7,
    GlDataType.Float,
    3
  )
  static ColorLocation = new AttributeLocation(
    'color',
    8,
    GlDataType.Float,
    4
  )
}