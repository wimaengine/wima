/** @import {EventReader} from '../typedef/index.js' */
import { CEvent } from './event.js'

// TODO - use a pooling to reduce memory allocations.
/**
 * A buffer of events that are of the same type.
 * 
 * @template T
 * @example
 * ```typescript
 * //Creates a new event dispatcher with string as its event payload.
 * const dispatch = new EventDispatch<string>()
 * 
 * //adds an event to dispatcher
 * dispatch.write("hello there")
 * 
 * //gets all events in the event dispatch
 * dispatch.each(event=>{
 *   console.log(event.data)//outputs "hello world"
 * })
 * 
 * //Removes all buffered events.
 * dispatch.clear()
 * ```
 */
export class EventDispatch {

  /**
   * @private
   * @type {CEvent<T>[]}
   */
  buffer = []

  /**
   * Clear the events.
   */
  clear() {
    this.buffer.length = 0
  }

  /**
   * @param {EventReader<T>} callback
   */
  each(callback) {
    for (let i = 0; i < this.buffer.length; i++) {
      callback(this.buffer[i])
    }
  }

  /**
   * Returns the first of the events captured if any event is captured.
   * 
   * @returns {CEvent<T> | undefined}
   */
  readFirst() {
    return this.buffer[0]
  }

  /**
   * @returns {CEvent<T> | undefined}
   */
  readLast() {
    return this.buffer[this.buffer.length - 1]
  }

  /**
   * @param {T} data
   */
  write(data) {
    this.buffer.push(new CEvent(data))
  }
}