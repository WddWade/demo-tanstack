import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders, setResponseHeader } from "@tanstack/react-start/server"
import { useState } from "react"
import { useLiveQuery } from "@tanstack/react-db"
import { customersCollection } from "../collections/customers"
import { queryClient } from "@/integrations/tanstack-query/root-provider"
import { useForm, useStore, revalidateLogic } from "@tanstack/react-form"
import { z } from "zod"

const setServerCookie = (responseHeaders: Headers) => {
  const responseCookies = typeof responseHeaders?.getSetCookie === "function"
    ? responseHeaders.getSetCookie()
    : [responseHeaders.get("set-cookie") ?? ""]

  if (responseCookies.length) for (const cookie of responseCookies) {
    setResponseHeader("Set-Cookie", cookie)
  }
}

export const loginAccount = createServerFn()
  .inputValidator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {

    const response = await fetch("http://api.beones.tw/api/login", {
      method: "POST",
      body: JSON.stringify(data)
    })
    const datas = await response.json()
    if (datas.status) setServerCookie(response.headers)

    return datas
  })


export const Route = createFileRoute("/")({
  ssr: false,
  component: App
})

function App() {
  const {
    data: customersDatas,
    collection: customersDB
  } = useLiveQuery((query) => query
    .from({ customers: customersCollection(queryClient) })
  )

  if (!customersDatas) return null

  customersDatas && console.log("customers", customersDB.get(45241));

  const schemas = z.object({
    account: z.string().min(1, "A account is required"),
    password: z.string().min(4, "A password is required"),
  })

  const configs = [
    { id: 1, field: "account", label: "Account" },
    { id: 2, field: "password", label: "Password" }
  ]

  const defaultValues = configs.reduce(
    (initValue, field) => ({ ...initValue, [field.field]: "" }),
    {} as Record<string, any>
  )

  const form = useForm({
    defaultValues: defaultValues,
    validators: { onChange: schemas },
    validationLogic: revalidateLogic(),
    onSubmitInvalid() {
      const InvalidInput = document.querySelector('[aria-invalid="true"]') as HTMLInputElement
      InvalidInput?.focus()
    },
    onSubmit: async ({ value }) => {
      const { status, data } = await loginAccount({ data: value })
      console.log(status, data)
    },
  })

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
      {configs.map((config) => <div
        key={config.id}
        className={cn("flex flex-col")}
      >
        <form.Field name={config.field}>
          {(field) => (<>
            <label htmlFor={field.name}>{config.label}</label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              aria-invalid={
                !field.state.meta.isValid && field.state.meta.isTouched
              }
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <p>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert">{field.state.meta.errors[0]?.["message"]}</em>
              )}
            </p>
          </>)}

        </form.Field>

      </div>)}

      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div onClick={canSubmit ? form.handleSubmit : undefined}
          >{isSubmitting ? '...' : 'Submit'}</div>
        )}
      </form.Subscribe>

    </div>
  )
}

