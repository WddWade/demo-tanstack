import Header from '@/components/Header'
import { QueryProvider, queryClient } from '@/integrations/tanstack-query/root-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(pages)')({
  component: RouteLayout,
})

function RouteLayout() {
  return (
    <QueryProvider>
      <Header />
      <Outlet />
    </QueryProvider>

  )


}
