// src/start.ts
import { createMiddleware, createStart } from '@tanstack/react-start'

const authMiddleware = createMiddleware({ type: "request" })
    .server(async ({ request, next }) => {
        console.log("authMiddleware", request.url);
        return next()
        //...
    })
const fnMiddleware = createMiddleware({ type: "function" })
    .client(async ({ next }) => {
        const result = await next()
        // Woah! We have the time from the server!
        console.log('Time from the server:', result.context.timeFromServer)

        return result
    })
    .server(async ({ context, next }) => {
        console.log("authMiddleware", request.url);
        return next()
        //...
    })

export const startInstance = createStart(() => {
    return {
        functionMiddleware: [fnMiddleware],
        requestMiddleware: [authMiddleware],
    }
}) 