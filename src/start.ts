// src/start.ts
import { createMiddleware, createStart } from '@tanstack/react-start'

const requestMiddleware = createMiddleware({ type: "request" })
    .server(async ({ request, next, context }) => {
        console.log("authMiddleware.server", context);

        const result = await next()
        result.response.headers.set('x-powered-by', 'tanstack')

        return result
        //...
    })

const functionClientMiddleware = createMiddleware({ type: "function" })
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
        console.log("functionMiddleware.client");
        const result = await next({ sendContext: nextContext })

        return result
    })

const functionServerMiddleware = createMiddleware({ type: "function" })
    .server(async ({ context, next }) => {
        // console.log("authMiddleware", request.url);
        console.log("functionMiddleware.server", context);

        return next()
        //...
    })

export const startInstance = createStart(() => {
    return {
        functionMiddleware: [functionClientMiddleware, functionServerMiddleware],
        requestMiddleware: [requestMiddleware],
    }
}) 