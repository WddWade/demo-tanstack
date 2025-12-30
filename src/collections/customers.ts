import { createCollection, eq, useLiveQuery } from "@tanstack/react-db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import type { QueryClient } from "@tanstack/react-query"


export const getCustomers = createServerFn()
    .inputValidator((data: Record<string, any>) => data)
    .handler(async ({ data }) => {
        const requestHeaders = getRequestHeaders()
        const requesCookies = requestHeaders.get("cookie") ?? ""
        const headers = new Headers()

        headers.set("Content-Type", "application/json")
        headers.set("cookie", requesCookies || "")
        const response = await fetch("http://api.beones.tw/api/cms/site-a-tw/units/customers_company", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
        const datas = await response.json()
        return datas
    })

export const customersCollection = (queryClient: QueryClient) => createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ["customers"],
        queryFn: async () => {
            const { status, datasets } = await getCustomers({ data: { _acions: "read" } })
            if (!status) return []

            const { lists } = datasets
            return lists
        },
        getKey: (item: any) => item.id,
        onInsert: async () => { },
        onUpdate: async ({ transaction }) => {
            const { original, modified } = transaction.mutations[0]
            await fetch(`/api/todos/${original.id}`, {
                method: "PUT",
                body: JSON.stringify(modified),
            })
        },
        onDelete: async () => { }
    })
)