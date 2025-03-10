# Chaos-engine
This is an ECS driven game engine written in javascript.

## Features of this game engine.

 - An entity-component-system architecture where entities are made up of components and components are updated by their respective systems.Data-driven systems only.
 - A semi-realistic physics engine that features the following:
    - Collision Masking:Used to allow or disallow physical bodies from colliding with each other.

    - Narrowphase:Provides collision manifold from a given pair of bodies if the bodies are colliding.
    
    - Broadphase:Used to improve performance of the physics world by calculating pairs of bodies that could possibly be colliding.
    
    - Static and Dynamic bodies types:Static bodies do not respond to collision with other bodies(due to infinite mass) while dynamic bodies respond to collision forces.
    
    - Friction:Bodies colliding experience friction between their two surfaces.
    
    - Sleeping:Bodies at rest do not need to be tested every frame hence are put to "sleep" to improve performance of the physics engine.
        
    - Querying:The world can be queried to know if bodies are within a certain range(either a bounding-box or bounding-circle).
    
    - Iterative solving for velocity to improve non-rotational stacking.
    
    - Shapes:Various convex shapes are supported in the physics engine.
 - A set of loaders to load game assets.
 - A storage API to store data in cookies, sessions or local storage.
 - An input abstraction that normalizes input from the keyboard,mouse and touch on mobile devices.
 - A math library with support for 2D and 3D vectors, matrices and quaternion.

## Gettimg Started
TODO

## Contributing
Will be available when a contribution guide is written.

