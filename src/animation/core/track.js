import { AnimationInterpolant } from './interpolant.js'

export class AnimationTrack {
  times = []
  keyframes = []
  type = KeyFrameType.Number
  interpolation = AnimationInterpolant.Linear
  validate(){
    //Validates keyframe times are in ascending order
    //the len of keyframes is equal to times
  }
  elementSize(){
    //get size of keyframetype.
  }
  length(){
    //number of keyframes.
  }
}
export const KeyFrameType = {
  Number: 0,
  Vector2: 1,
  Vector3: 2,
  Quaternion: 3
}