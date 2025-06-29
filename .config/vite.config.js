import { defineConfig } from "vite"
import {resolve} from 'path'
import { cwd } from "process"

export default defineConfig({
    server: {
        port: 8082,
        strictPort: true,
        open: "/demos/index.html",
    },
    resolve: {
        alias: [{
            find:'wima',
            replacement:resolve(cwd(),'/src/index.js')
        }]
    }
})