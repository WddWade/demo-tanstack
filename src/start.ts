// src/start.ts
import { createMiddleware, createStart } from '@tanstack/react-start'

const authMiddleware = createMiddleware({ type: "request" })
    .server(async ({ request, next }) => {
        console.log("authMiddleware", request.url);
        return next()
        //...
    })

export const startInstance = createStart(() => {
    return {
        requestMiddleware: [authMiddleware],
    }
}) 