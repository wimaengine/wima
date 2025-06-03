import { lerp } from '../../math/index.js'

export class AnimationTrack {
  times = []
  keyframes = []
  type = KeyFrameType.Position2D
  validate() {
    //Validates keyframe times are in ascending order
    for (let i = 1; i < this.times.length; i++) {
      const last = this.times[i - 1]
      const current = this.times[i]
      if (last > current) {
        return false
      }
    }
    //the len of keyframes is equal to times
    if (this.keyframes.length / this.elementSize() !== this.times.length) {
      return false
    }
    return true
  }
  elementSize() {
    //get size of keyframetype.
    switch (this.type) {
      case KeyFrameType.Orientation2D:
        return 1
      case KeyFrameType.Position2D:
      case KeyFrameType.Scale2D:
        return 2
      case KeyFrameType.Position3D:
      case KeyFrameType.Scale3D:
        return 3
      case KeyFrameType.Orientation3D:
        return 4
      default:
        throw "Keyframe type is not supported."
    }
  }
  length() {
    return this.times.length
  }
  
  getCurrent(delta) {
    const [indexA, indexB, t] = this.getCurrentLerp(delta)
    
    const computed = []
    const elementSize = this.elementSize()
    
    for (let i = 0; i < elementSize; i++) {
      const a = this.keyframes[indexA * elementSize + i]
      const b = this.keyframes[indexB * elementSize + i]
      
      const value = lerp(a, b, t)
      computed[i] = value
    }
    return computed
  }
  getCurrentLerp(delta) {
    const lastindex = this.times.length - 1
    let timestamp
    if (delta <= this.times[0]) {
      return [0, 0, 0]
    }
    if (delta >= this.times[lastindex]) {
      return [lastindex, lastindex, 0]
    }
    for (let i = 0; i < this.times.length; i++) {
      if (this.times[i] >= delta) {
        timestamp = i
        break
      }
    }
    const start = this.times[timestamp - 1]
    const end = this.times[timestamp]
    
    const distance = start - end
    const covered = start - delta
    const centage = covered / distance
    
    return [timestamp - 1, timestamp, centage]
  }
}
export const KeyFrameType = {
  Position2D: 0,
  Position3D: 1,
  Orientation2D: 2,
  Orientation3D: 3,
  Scale2D: 4,
  Scale3D: 5,
}