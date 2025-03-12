# Setup environment.
## Download and installation.
There are several ways to get a copy of the engine:
### Vite development.
This most prefered way to get the package.

This requires that you have npm (the default package manager for nodejs) installed.


### Node Package Manager.
Use this method if you already have a project in which you want to the package.

For this method, you require to have npm installed and a node project already created.

 1. Open the terminal and navigate to the root of your desired node project.
 2. Run the following command in the terminal:
    ```bash
    npm install wima
    ```

### CDN
In your project, add the engine library in your project using the unpkg CDN like so:
 - For ES modules:
    ```html
    <head>
      <script src="https://unpkg.com/wima@latest/dist/index.module.js"></script>
    </head>
    ```
 - For AMD modules:
    ```html
    <head>
      <script src="https://unpkg.com/wima@latest/dist/index.umd.js"></script>
    </head>
    ```

### Build the engine yourself
For this method,you will need to follow the [build instructions](../../build/index.js)

### Setup
With the previous steps taken,open the project in your IDE or code editor.

In you scripts, you can now import the symbol exported by the library in two ways:
 - For ESM
    ```javascript
    import * as WIMA from 'wima';
    ```
 - For AMD/CommonJs
    ```javascript
    const WIMA = require('wima'):
    ```

This guide will be using the ESM modules for simplicity.