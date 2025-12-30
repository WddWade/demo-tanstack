import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { queryClient } from './integrations/tanstack-query/root-provider'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultNotFoundComponent: () => <p>NotFoundPage</p>,
    defaultPreload: 'intent',
  })

  setupRouterSsrQueryIntegration({ router, queryClient: queryClient })

  return router
}
