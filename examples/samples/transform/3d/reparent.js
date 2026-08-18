import {
  App,
  AppSchedule,
  BasicMaterial,
  BasicMaterialAssets,
  BasicMaterialInstance,
  Color,
  DefaultPlugin,
  DOMWindowPlugin,
  EntityCommands,
  EntityHandle,
  FPSDebugger,
  KeyCode,
  Keyboard,
  Mesh,
  MeshAssets,
  Orientation3D,
  Query,
  Quaternion,
  VirtualClock,
  WebglRendererPlugin,
  createBasicMesh3D
} from 'wima'
import { addDefaultCamera3D, HackPlugin, setupViewportWebgl } from '../../utils.js'

class LeftDock { }
class RightDock { }
class ShowcaseChild { }
class ActiveDock { }

const idleDockColor = new Color(0.18, 0.22, 0.28)
const activeLeftColor = new Color(0.36, 0.91, 0.84)
const activeRightColor = new Color(0.99, 0.73, 0.31)
const childColor = new Color(0.98, 0.99, 1)
const dockSpacing = 0.72
const dockSpinSpeed = 0.45
const childSpinSpeed = 0.75

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: spawnShowcase })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera3D })
  .registerSystem({ schedule: AppSchedule.Update, system: update })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewportWebgl })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {import('@wimaengine/ecs').World} world
 */
function spawnShowcase(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const dockMesh = meshes.add(Mesh.cube(0.22, 0.22, 0.22))
  const childMesh = meshes.add(Mesh.cube(0.14, 0.14, 0.14))

  const leftMaterial = materials.add(new BasicMaterial({
    color: activeLeftColor.clone()
  }))
  const rightMaterial = materials.add(new BasicMaterial({
    color: idleDockColor.clone()
  }))
  const childMaterial = materials.add(new BasicMaterial({
    color: childColor.clone()
  }))

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(dockMesh, leftMaterial, -dockSpacing, 0, 0),
      new LeftDock(),
      new ActiveDock()
    ])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(dockMesh, rightMaterial, dockSpacing, 0, 0),
      new RightDock()
    ])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(childMesh, childMaterial),
      new ShowcaseChild()
    ])
    .build()
}

/**
 * @param {import('@wimaengine/ecs').World} world
 */
function update(world) {
  const keyboard = world.getResource(Keyboard)
  const materials = world.getResource(BasicMaterialAssets)
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()
  const leftDock = new Query(world, [EntityHandle, LeftDock, Orientation3D, BasicMaterialInstance]).single()
  const rightDock = new Query(world, [EntityHandle, RightDock, Orientation3D, BasicMaterialInstance]).single()
  const child = new Query(world, [EntityHandle, ShowcaseChild, Orientation3D, BasicMaterialInstance]).single()
  const activeDock = new Query(world, [EntityHandle, ActiveDock]).single()
  let activeDockEntity = activeDock?.[0]

  if (
    keyboard.justPressed(KeyCode.Space) ||
    keyboard.justPressed(KeyCode.KeyR)
  ) {
    if (!leftDock || !rightDock || !child) {
      return
    }

    if (!activeDockEntity) {
      activeDockEntity = leftDock[0]
    }

    const nextDock = activeDockEntity.equals(leftDock[0]) ? rightDock[0] : leftDock[0]

    if (!nextDock.equals(activeDockEntity)) {
      world.remove(activeDockEntity, [ActiveDock])
      world.insert(nextDock, [new ActiveDock()])
      activeDockEntity = nextDock
    }

    new EntityCommands(world).reparent(child[0], nextDock)
  }

  if (leftDock) {
    leftDock[2].multiply(Quaternion.fromEuler(0, 0, delta * dockSpinSpeed))
  }

  if (rightDock) {
    rightDock[2].multiply(Quaternion.fromEuler(0, 0, -delta * dockSpinSpeed))
  }

  if (child) {
    child[2].multiply(Quaternion.fromEuler(0, 0, -delta * childSpinSpeed))
  }

  const left = leftDock ? materials.get(leftDock[3].handle) : null
  const right = rightDock ? materials.get(rightDock[3].handle) : null
  const childPaint = child ? materials.get(child[3].handle) : null
  const isLeftActive = Boolean(
    activeDockEntity &&
    leftDock &&
    activeDockEntity.equals(leftDock[0])
  )

  if (left) {
    left.color.copy(isLeftActive ? activeLeftColor : idleDockColor)
  }

  if (right) {
    right.color.copy(isLeftActive ? idleDockColor : activeRightColor)
  }

  if (childPaint) {
    childPaint.color.copy(childColor)
  }
}
