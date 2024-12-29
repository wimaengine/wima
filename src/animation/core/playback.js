import { AnimationRepeat } from "./repeat.js"

export class AnimationPlayback {
  speed = 1
  elapsed = 0
  seekTime = 0
  repeatMode = AnimationRepeat.None
  paused = false
}