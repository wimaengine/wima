import { ContactData } from "./contactdata.js"
import { Vector2 } from "../../math/index.js"

/**
 * @param {Vector2} distance The distance vector from sphere2 to sphere1.
 */
export function intersectCircles(circle1, circle2, distance) {
  const radiusSum = circle1.radius + circle2.radius
  const overlap = (radiusSum * radiusSum) - distance.magnitudeSquared()
  if (overlap == 0) {
    return new ContactData({
      overlap,
      normal: Vector2.Y.clone()
    })
  }
  const normal = distance.clone().normalize()
  return new ContactData({ overlap, normal })
}

/**
 * @param {Vector2} distance The distance vector from sphere2 to sphere1.
 */
export function intersectSpheres(sphere1, sphere2, distance) {
  const sum = radius1 + radius2
  const overlap = (radiusSum * radiusSum) - distance.magnitudeSquared()
  if (overlap == 0) {
    distance.set()
  }
  const normal = distance.clone().normalize()
  return new ContactData({ overlap, normal })
}

export function intersectCuboids(box1, box2) {
  return (
    box1.max.x < box2.min.x ||
    box1.min.x > box2.max.x ||
    box1.max.y < box2.min.y ||
    box1.min.y > box2.max.y ||
    box1.max.z < box2.min.z ||
    box1.min.z > box2.max.z ?
    false : true
  )
}

export function intersectSpherePlane(sphere, plane, distance) {
  return Math.abs(plane.distanceToPoint(center)) <= sphere.radius;
}

export function intersectCuboidSphere(box, sphere, distance) {
  box.clampPoint(center, _vector);

  return _vector.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
}

export function intersectCuboidPlane(box, plane, distance) {
  let min, max;

  if (plane.normal.x > 0) {

    min = plane.normal.x * this.min.x;
    max = plane.normal.x * this.max.x;

  } else {

    min = plane.normal.x * this.max.x;
    max = plane.normal.x * this.min.x;

  }

  if (plane.normal.y > 0) {

    min += plane.normal.y * this.min.y;
    max += plane.normal.y * this.max.y;

  } else {

    min += plane.normal.y * this.max.y;
    max += plane.normal.y * this.min.y;

  }

  if (plane.normal.z > 0) {

    min += plane.normal.z * this.min.z;
    max += plane.normal.z * this.max.z;

  } else {

    min += plane.normal.z * this.max.z;
    max += plane.normal.z * this.min.z;

  }

  return (min <= -plane.constant && max >= -plane.constant);

}

export function intersectCuboidTriangle(box, triangle, distance) {
  this.getCenter(_center);
  _extents.subVectors(this.max, _center);

  _v0.subVectors(triangle.a, _center);
  _v1.subVectors(triangle.b, _center);
  _v2.subVectors(triangle.c, _center);

  // compute edge vectors for triangle
  _f0.subVectors(_v1, _v0);
  _f1.subVectors(_v2, _v1);
  _f2.subVectors(_v0, _v2);

  // test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
  // make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
  // axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
  let axes = [
			0, -_f0.z, _f0.y, 0, -_f1.z, _f1.y, 0, -_f2.z, _f2.y,
			_f0.z, 0, -_f0.x, _f1.z, 0, -_f1.x, _f2.z, 0, -_f2.x,
			-_f0.y, _f0.x, 0, -_f1.y, _f1.x, 0, -_f2.y, _f2.x, 0
		];
  if (!satForAxes(axes, _v0, _v1, _v2, _extents)) {

    return false;

  }

  // test 3 face normals from the aabb
  axes = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  if (!satForAxes(axes, _v0, _v1, _v2, _extents)) {

    return false;

  }

  // finally testing the face normal of the triangle
  // use already existing triangle edge vectors here
  _triangleNormal.crossVectors(_f0, _f1);
  axes = [_triangleNormal.x, _triangleNormal.y, _triangleNormal.z];

  return satForAxes(axes, _v0, _v1, _v2, _extents);

}

export function intersectsFrustumSphere(frustum, sphere, distance) {
  const planes = frustum.planes;
  const center = sphere.center;
  const negRadius = -sphere.radius;

  for (let i = 0; i < 6; i++) {
    const distance = planes[i].distanceToPoint(center);

    if (distance < negRadius) {

      return false;
    }
  }

  return true;
}

export function intersectFrustumBox(frustum, box, distance) {
  const planes = this.planes;

  for (let i = 0; i < 6; i++) {
    const plane = planes[i];
    _vector.x = plane.normal.x > 0 ? box.max.x : box.min.x;
    _vector.y = plane.normal.y > 0 ? box.max.y : box.min.y;
    _vector.z = plane.normal.z > 0 ? box.max.z : box.min.z;

    if (plane.distanceToPoint(_vector) < 0) {

      return false;
    }
  }

  return true;
}

export function intersectPlaneLine(plane, line, distance) {
  const direction = line.delta(_vector1);
  const denominator = this.normal.dot(direction);

  if (denominator === 0) {
    if (this.distanceToPoint(line.start) === 0) {
      return target.copy(line.start);
    }
    return null;
  }

  const t = -(line.start.dot(this.normal) + this.constant) / denominator;

  if (t < 0 || t > 1) {
    return null;
  }

  return target.copy(line.start).addScaledVector(direction, t);
}