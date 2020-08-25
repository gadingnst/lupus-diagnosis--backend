declare global {
    namespace NodeJS {
        interface Global {
            __basedir: string
        }

        interface ProcessEnv {
            SECRET_KEY: string;
        }
    }
}

global.__basedir = __dirname

import Server from './server'

// start server
const server = new Server()
server.run()
