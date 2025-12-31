// src/start.ts
import { createMiddleware, createStart } from '@tanstack/react-start'

const requestMiddleware = createMiddleware({ type: "request" })
    .server(async ({ request, next }) => {
        console.log("authMiddleware.server", request.url);
        return next()
        //...
    })

const functionMiddleware = createMiddleware({ type: "function" })
    .client(async ({ next }) => {
        const result = await next()
        // Woah! We have the time from the server!
        console.log("functionMiddleware.client");
        // console.log('Time from the server:', result.context.timeFromServer)

        return result
    })
    .server(async ({ context, next }) => {
        // console.log("authMiddleware", request.url);
        console.log("functionMiddleware.server");
        return next()
        //...
    })

export const startInstance = createStart(() => {
    return {
        functionMiddleware: [functionMiddleware],
        requestMiddleware: [requestMiddleware],
    }
}) 