import { PlaybackRepeat } from "./repeat.js"

export class Playback {
  speed
  duration
  elapsed = 0
  repeatMode
  paused = false
  constructor({
    duration,
    speed = 1,
    repeatMode = PlaybackRepeat.None
  }) {
    this.duration = duration
    this.speed = speed
    this.repeatMode = repeatMode
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
    
    const seekTime = this.elapsed + delta * this.speed
    this.elapsed = seekTime
    switch (this.repeatMode) {
      case PlaybackRepeat.None:
        this.elapsed = Math.min(this.duration, seekTime)
        break;
      case PlaybackRepeat.Forever:
        
        this.elapsed %= this.duration
        break;
    }
  }
}