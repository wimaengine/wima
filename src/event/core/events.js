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
 * const dispatch = new Events<string>()
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
export class Events {

  /**
   * @private
   * @type {CEvent<T>[]}
   */
  writeBuffer = []
  
  /**
   * @private
   * @type {CEvent<T>[]}
   */
  readBuffer = []

  /**
   * Clear the events.
   */
  clear() {
    this.readBuffer = this.writeBuffer
    this.writeBuffer = []
  }

  /**
   * @param {EventReader<T>} callback
   */
  each(callback) {
    for (let i = 0; i < this.readBuffer.length; i++) {
      callback(this.readBuffer[i])
    }
  }

  /**
   * Returns the first of the events captured if any event is captured.
   * 
   * @returns {CEvent<T> | undefined}
   */
  readFirst() {
    return this.readBuffer[0]
  }

  /**
   * @returns {CEvent<T> | undefined}
   */
  readLast() {
    return this.readBuffer[this.readBuffer.length - 1]
  }

  /**
   * @param {T} data
   */
  write(data) {
    this.writeBuffer.push(new CEvent(data))
  }

  count(){
    return this.readBuffer.length
  }
}