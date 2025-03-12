# Architecture

A wima application contains the following:

 - App: This is the skeleton which binds worlds and thier schedules.

 - World: This is a collection of entities (each with thier own components) and resources.

 - Entity: It is a collection of components. It is implemented as a numerical identifier.

 - Component: This is a piece of state/data attached to an entity.They store state related to an entity such as its position,rotation e.t.c.

 - System: This is a function which operate on components.

 - Resource:This store state related to the entire world.These are akin to singletons.Semi-synonymous with definitions in other game engines such as Unity's scriptable objects and Godot's Resources.An example is `VirtualClock` which tracks ingame time.

 - Plugin: These are collections of systems and resources that can be registered to an app.