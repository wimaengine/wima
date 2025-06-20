/**
 * @readonly
 * @enum {number}
 */
export const ShapeType = {
  Circle: 0,
  POLYGON: 1
}

/**
 * @readonly
 * @enum {number}
 */
export const BodyType = Object.freeze({
  DYNAMIC: 2,
  KINEMATIC: 1,
  STATIC: 0
})

// Default settings
export const PhysicsSettings = {

  // For the world
  posDampen: 0.3,
  linearDamping: 0.001,
  angularDamping: 0.001,
  velocitySolverIterations: 10,
  fixedFrameRate: 1 / 60,
  penetrationSlop: 0.1,
  positionCorrection: true,
  warmStarting: false,
  impulseAccumulation: false,
  separationTolerance: 0.1,

  // For all bodies
  type: BodyType.DYNAMIC,
  mass: 1,
  restitution: 0.6,
  staticFriction: 1,
  kineticFriction: 0.5,
  boundPadding: 0,
  allowSleep: false,
  aabbDetectionOnly: false,
  collisionResponse: true,
  autoUpdateBound: true
}