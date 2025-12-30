import { queryClient } from "@/integrations/tanstack-query/root-provider"
import { customersCollection } from "./customers"

const collectionsDB: Record<string, any> = {
    customers: customersCollection
}

export const DB = (collection: string) => {
    const collections = collectionsDB[collection]

    if (collections) return collections?.(queryClient)
    return []
}
