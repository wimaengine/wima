import { PlaybackRepeat } from "./repeat.js"

export class Playback {
  speed = 1
  duration = 0
  elapsed = 0
  repeatMode = AnimationRepeat.None
  paused = false
  constructor({ duration, speed = 1 } = {}) {
    this.withSettings(settings)
  }
  
  start() {
    this.elapsed = 0
    this.play()
  }
  stop() {
    this.elapsed = 0
    this.pause()
  }
  play() {
    this.paused = false
  }
  pause() {
    this.paused = true
  }
  update(delta) {
    if (this.paused) {
      return
    }
    
    const seekTime = elapsed + dt * playback.speed
    
    switch (this.repeatMode) {
      case PlaybackRepeat.None:
        this.elapsed = Math.min(this.duration, seekTime)
        break;
      case PlaybackRepeat.Forever:
        playback.elapsed %= clip.duration
        break;
    }
  }
  
  withSettings(settings) {
    this.duration = duration
    this.speed = speed
  }
}