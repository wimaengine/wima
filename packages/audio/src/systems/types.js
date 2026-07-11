import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { Graph } from '@wimaengine/datastructures'
import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Audio } from '../assets'
import { AudioOscillator, AudioOscillatorType, AudioPlayer, AudioPlayerSnapshot } from '../components'
import { AudioCommands, AudioGraph } from '../resources'

/**
 * @param {World} world
 */
export function registerAudioTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const oscillatorTypeId = setTypeId('AudioOscillatorType')
  const audioBufferId = setTypeId('AudioBuffer')

  registry.registerTypeId(oscillatorTypeId, new EnumInfo(AudioOscillatorType))
  registry.registerTypeId(audioBufferId, new OpaqueInfo())

  registry.register(Audio, new StructInfo({
    audiobuffer: new Field(audioBufferId)
  }))

  registry.register(AudioPlayer, new StructInfo({
    sourceNode: new Field(typeid(Number), true),
    attach: new Field(typeid(Number), true),
    audio: new Field(typeidGeneric(Handle, [Audio]), true)
  }))
  registry.get(AudioPlayer)?.setMethod(AudioPlayer.copy)
  registry.get(AudioPlayer)?.setMethod(AudioPlayer.clone)
  registry.get(AudioPlayer)?.setMethod(AudioPlayer.prototype.toSnapshot)
  registry.register(AudioPlayerSnapshot, new StructInfo({
    sourceNode: new Field(typeid(Number), true),
    attach: new Field(typeid(Number), true),
    audio: new Field(typeid(HandleSnapshot), true)
  }))
  registry.get(AudioPlayerSnapshot)?.setMethod(AudioPlayerSnapshot.serialize)
  registry.get(AudioPlayerSnapshot)?.setMethod(AudioPlayerSnapshot.deserialize)
  registry.get(AudioPlayerSnapshot)?.setMethod(AudioPlayerSnapshot.prototype.fromSnapshot)
  registry.register(AudioOscillator, new StructInfo({
    sourceNode: new Field(typeid(Number), true),
    type: new Field(oscillatorTypeId),
    attach: new Field(typeid(Number), true),
    detune: new Field(typeid(Number)),
    frequency: new Field(typeid(Number))
  }))
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.copy)
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.clone)
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.serialize)
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.deserialize)
  registry.register(AudioGraph, new StructInfo({
    graph: new Field(typeid(Graph))
  }))
  registry.register(AudioCommands, new StructInfo({}))
}
