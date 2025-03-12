# Building the project
This assumes that you already know how to
use [git](https://git-scm.com) and [nodejs](https://nodejs.org)

## Setup and environment
Ensure you have [git](https://git-scm.com/downloads) and [nodejs](https://nodejs.org/en/download)  installed.

## Getting the repo
[Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the repo.

[Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) the forked repository to your local computer.

[Install the dependencies](https://docs.npmjs.com/downloading-and-installing-packages-locally) by using the following bashcommand on the project directory:
```bash
npm i
```

## Commands
### Building the library
The command for building the library is:
```bash
npm run build:src
```

This will produce a `dist` folder with the libraries:
 - `index.module.js`: The [ES module](https://nodejs.org/api/esm.html) build file, used for projects which use ESM modules.This is the default library export.
 - `index.amd.js`: The [UMD module](https://github.com/umdjs/umd/blob/master/README.md) build file, used for compatability with projects using [CommonJs](https://nodejs.org/api/modules.html) , [AMD](https://requirejs.org/docs/whyamd.html) and global modules.
 - `index.module.d.ts`: The build file containing types.

### Building the documentation website
The command for building the docs is:
```bash
npm run build:docs
```
This will produce a `docs` folder with the website for the docs.