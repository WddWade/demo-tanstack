// src/start.ts
import { createMiddleware, createStart } from '@tanstack/react-start'

const requestMiddleware = createMiddleware({ type: "request" })
    .server(async ({ request, next }) => {
        console.log("authMiddleware.server", request.url);
        return next()
        //...
    })

const functionMiddleware = createMiddleware({ type: "function" })
    .client(async ({
        data,
        context,
        sendContext,
        method,
        signal,
        next,
        filename,
        functionId,
    }) => {
        const nextContext = { name: "wade" }
        return next({ sendContext: nextContext })
    })
    .server(async ({ context, next }) => {
        // console.log("authMiddleware", request.url);
        console.log("functionMiddleware.server", context);
        return next()
        //...
    })

export const startInstance = createStart(() => {
    return {
        functionMiddleware: [functionMiddleware],
        requestMiddleware: [requestMiddleware],
    }
}) 