import { defineConfig } from "vite"
import {resolve} from 'path'
import { cwd } from "process"

export default defineConfig({
    publicDir:'assets',
    server: {
        port: 8082,
        strictPort: true,
        open: "/examples/index.html",
    },
    resolve: {
        alias: [{
            find:'wima',
            replacement:resolve(cwd(),'/src/index.js')
        }]
    }
})