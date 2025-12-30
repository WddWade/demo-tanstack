import { createFileRoute } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useLiveQuery } from "@tanstack/react-db"
import { DB } from "@/collections/db"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCustomers } from "@/collections/customers"
import { queryClient as queryClient2 } from "@/integrations/tanstack-query/root-provider"

export const Route = createFileRoute("/(pages)/")({
  component: IndexPage
})

function IndexPage() {

  const queryClient = useQueryClient()

  const { data, refetch } = useQuery<any>({
    queryKey: ['customers'],
    queryFn: async () => getCustomers({ data: { _acions: "read" } }),
    initialData: [],
  }, queryClient)

  // const {
  //   data: customersDatas,
  //   collection: customersDB
  // } = useLiveQuery((query) => query
  //   .from({ customers: DB("customers") })
  // )

  // if (!customersDatas) return null

  // customersDatas && console.log("customers", customersDB.get(45241));



  return (
    <div className={cn(
      "w-full",
      "flex",
      "flex-col",
      "justify-start",
      "items-center",
      "py-10",
      "[&_input]:text-black",
      "[&_input]:bg-black/10"
    )}>
      Index Page
    </div>
  )
}

