import { test, describe } from "node:test";
import { Timer, TimerMode } from "../index.js";
import { strictEqual } from "node:assert";

describe("Testing `Timer`", () => {
  test('`Timer` on once mode completes', () => {
    const timer = new Timer({ duration: 1, mode: TimerMode.Once })

    timer.update(1)

    strictEqual(timer.completed(), true)
  })

  test('`Timer` on repeat mode never completes', () => {
    const timer = new Timer({ duration: 1, mode: TimerMode.Repeat })

    timer.update(100000)

    strictEqual(timer.completed(), false)
  })

  test('`Timer` on once gives correct elapsed time', () => {
    const timer1 = new Timer({ duration: 10, mode: TimerMode.Once })
    const timer2 = new Timer({ duration: 10, mode: TimerMode.Once })
    const timer3 = new Timer({ duration: 10, mode: TimerMode.Once })
    const timer4 = new Timer({ duration: 10, mode: TimerMode.Once })
    const timer5 = new Timer({ duration: 10, mode: TimerMode.Once })

    timer1.update(0)
    timer2.update(5)
    timer3.update(5)
    timer3.update(3)
    timer4.update(10)
    timer5.update(14)

    strictEqual(timer1.elapsed(), 0)
    strictEqual(timer2.elapsed(), 5)
    strictEqual(timer3.elapsed(), 8)
    strictEqual(timer4.elapsed(), 10)
    strictEqual(timer5.elapsed(), 10)
  })

  test('`Timer` on repeat gives correct elapsed time', () => {
    const timer1 = new Timer({ duration: 10, mode: TimerMode.Repeat })
    const timer2 = new Timer({ duration: 10, mode: TimerMode.Repeat })
    const timer3 = new Timer({ duration: 10, mode: TimerMode.Repeat })
    const timer4 = new Timer({ duration: 10, mode: TimerMode.Repeat })
    const timer5 = new Timer({ duration: 10, mode: TimerMode.Repeat })

    timer1.update(0)
    timer2.update(5)
    timer3.update(5)
    timer3.update(3)
    timer4.update(10)
    timer5.update(14)

    strictEqual(timer1.elapsed(), 0)
    strictEqual(timer2.elapsed(), 5)
    strictEqual(timer3.elapsed(), 8)
    strictEqual(timer4.elapsed(), 0)
    strictEqual(timer5.elapsed(), 4)
  })

  test('`Timer` gives correct progress', () => {
    const timer1 = new Timer({ duration: 10, mode: TimerMode.Repeat })
    const timer2 = new Timer({ duration: 10, mode: TimerMode.Repeat })
    const timer3 = new Timer({ duration: 10, mode: TimerMode.Repeat })

    timer1.update(9)
    timer2.update(5)
    timer3.update(0)

    strictEqual(timer1.progress(), 0.9)
    strictEqual(timer2.progress(), 0.5)
    strictEqual(timer3.progress(), 0)
  })

  test('`Timer` gives correct completed cycles', () => {
    const timer1 = new Timer({ duration: 1, mode: TimerMode.Once })
    const timer2 = new Timer({ duration: 1, mode: TimerMode.Repeat })

    timer1.update(100)
    timer2.update(100)

    strictEqual(timer1.cyclesCompleted(), 1)
    strictEqual(timer2.cyclesCompleted(), 100)
  })

  test('`Timer` gives correct completed cycles per frame', () => {
    const timer1 = new Timer({ duration: 1, mode: TimerMode.Repeat })
    const timer2 = new Timer({ duration: 1, mode: TimerMode.Repeat })

    timer1.update(100)
    strictEqual(timer1.cyclesCompletedThisFrame(), 100)
    timer2.update(100)
    strictEqual(timer2.cyclesCompletedThisFrame(), 100)

  })

  test('`Timer` speed dilates time.', () => {
    const timer1 = new Timer({ duration: 1, mode: TimerMode.Repeat,speed: 2 })
    const timer2 = new Timer({ duration: 1, mode: TimerMode.Repeat, speed: 0.5 })

    timer1.update(0.4)
    timer2.update(0.4)
    strictEqual(timer1.elapsed(), 0.8)
    strictEqual(timer2.elapsed(), 0.2)

  })

  test('playback requested on play', () => {
    const timer = new Timer()

    timer.play()
    timer.update(100)

    strictEqual(timer.playbackChanged(), true)
  })

  test('playback requested on pause', () => {
    const timer = new Timer()

    timer.pause()
    timer.update(100)

    strictEqual(timer.playbackChanged(), true)
  })

  test('playback requested on reset', () => {
    const timer = new Timer()

    timer.reset()
    timer.update(100)

    strictEqual(timer.playbackChanged(), true)
  })

  test('playback requested on start', () => {
    const timer = new Timer()

    timer.start()
    timer.update(100)

    strictEqual(timer.playbackChanged(), true)
  })

  test('playback requested on stop', () => {
    const timer = new Timer()

    timer.stop()
    timer.update(100)

    strictEqual(timer.playbackChanged(), true)
  })

  test('playback requested on seek', () => {
    const timer = new Timer()

    timer.seek(0)
    timer.update(100)

    strictEqual(timer.playbackChanged(), true)
  })

  test('detect cycle started correctly.', () => {
    const timer1 = new Timer({ duration: 1, mode: TimerMode.Once })
    const timer2 = new Timer({ duration: 1, mode: TimerMode.Repeat })

    timer1.update(0)
    timer2.update(0)
    strictEqual(timer1.cycleStarted(), false)
    strictEqual(timer2.cycleStarted(), false)

    timer1.update(0.1)
    timer2.update(0.1)
    strictEqual(timer1.cycleStarted(), true)
    strictEqual(timer2.cycleStarted(), true)

    timer1.update(0.1)
    timer2.update(0.1)
    strictEqual(timer1.cycleStarted(), false)
    strictEqual(timer2.cycleStarted(), false)

    timer1.update(1)
    timer2.update(1)
    strictEqual(timer1.cycleStarted(), false)
    strictEqual(timer2.cycleStarted(), true)
  })

  test('detect cycle ended correctly.', () => {
    const timer1 = new Timer({ duration: 1, mode: TimerMode.Once })
    const timer2 = new Timer({ duration: 1, mode: TimerMode.Repeat })

    timer1.update(0)
    timer2.update(0)
    strictEqual(timer1.cycleEnded(), false)
    strictEqual(timer2.cycleEnded(), false)

    timer1.update(0.1)
    timer2.update(0.1)
    strictEqual(timer1.cycleEnded(), false)
    strictEqual(timer2.cycleEnded(), false)

    timer1.update(1)
    timer2.update(1)
    strictEqual(timer1.cycleEnded(), true)
    strictEqual(timer2.cycleEnded(), true)

    timer1.update(1)
    timer2.update(1)
    strictEqual(timer1.cycleEnded(), false)
    strictEqual(timer2.cycleEnded(), true)
  })
})