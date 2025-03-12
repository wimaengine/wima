# Committing
## Introduction
The project follows a strict committing style with the following rules:
 - The commits should be in simple present tense in an authoritative tone.See the [examples](##Examples)
 - Commits should focus on the technical effects of the changes (e.g adding a function,class,constant method) whilst the PRs will focus on the general overview of the changes made (e.g implementing physics).
 - A single commit for each technical change e.g moving a function/class/constant, adding a new function, deprecating a class, removing a constant, modifying a function e.t.c
 - A single commit should contain a single file unless its a move of a class/function/file/constant.

## Structure

The structure of a commit:
```text
[<scope>] <title> ...#<tags>

<message>
```
As seen, the commit body has the following:
 - scope: It is optional and is used to determine the scope of the commit.We use scope to indicate which package the commit is modifying.
 - title: It is the header of the commit.
 - tags:These are modifiers for generating the changelog. As of now,there are only two tags:
   - internal: Marks that a commit is only for internal use
   - ignore: Ignores the commit during changelog.
 - message: Sometimes,the title is not enough to give information about what you did.This is where you can give a more detailed explanation of what you have done.

## Examples
### Additions
This is when you add new functionality to the project.

#### Example 1
```text
Add `entityCount`
```
This indicates that you added a new constant called entityCount.

#### Example 2
```text
Add `World`
```
This indicates that you added a new class called World.

#### Example 3
```text
Add `despawn()`
```
This indicates that you added a new function despawn.

#### Example 4
```text
Add `World.spawn()`
```
This indicates that you added a new method spawn on World class.

#### Example 5
```text
Add `World.entities`
```
This indicates that you added a new property called entities on the World class.

#### Example 6
```text
Add documentation for `World.spawn()`
```
This indicates that you have added documentation for `World.spawn()`

#### Example 7
```text
Add `World` to exports
```
This indicates that you have added `World` to the package's exports(in this case, the package's index.js will be reexporting `World`).


#### Example 8
```text
Add `entityCount` to constant exports
```
This indicates that you have added `entityCount` to the package's constant exports(in this case, there is a folder called constants from where we reexport entityCount.)
### Removal
This is when you remove functionality from the project.

#### Example 1
```text
Remove `World.spawn()`

Was deprecated in version 0.1.0.
```
This indicates that you have removed spawn method of world as it was deprecated in the version 0.1.0.

### Deprecation
This is when you deprecate a functionality of the project.

#### Example 1
```text
Deprecate `World.remove()`
```
This indicates that you have deprecated spawn method of world.
In this case, there is nothing to replace it.

#### Example 2
```text
Deprecate `World.remove()`

Replaced by `World.despawn()`
```
This indicates that you have deprecated spawn method of world and despawn method will take its place.
### Modification
This is when you modify functionality of the project.
This should always have a message to detail what exactly is being done.

#### Example 1
```text
Modify `World.spawn()`

Now accepts an array of components instead of one component.
Changes signature to `(Component[])=>Entity`.
```
This indicates that you have modified spawn method of world to accept an array of components instead of one.

#### Example 2
```text
Modify `World.spawn()`

Removed uneccessary call to `World.reset()`
```
This indicates that you have modified spawn method of world to remove a call to `World.reset()`.
### Movement
This is when you want to move a file, function, class e.t.c.

#### Example 1
```text
Move readme to guide.
```
This indicates that you have moved the readme to the guide.

#### Example 2
```text
Move `World`

Move from core package to ecs package.
```
Indicates that you have moved the `World` to ecs package from the core package.

#### Example 3
```text
Move `World` #internal

Move from root to resources.
```
Indicates that you have moved the `World` to ecs package from the core package.This is marked as internal as we are only moving it within the package.