import { cn } from "@/lib/utils"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { useLiveQuery } from "@tanstack/react-db"
import { customersCollection, getCustomers } from "@/collections/customers"
import { queryClient } from "@/integrations/tanstack-query/root-provider"
import { useForm, revalidateLogic } from "@tanstack/react-form"
// import * as motion from "motion/react-client"
import { motion, AnimatePresence } from "motion/react"
import { z } from "zod"
import { DB } from "@/collections/db"
import { useQuery } from "@tanstack/react-query"

const schemas = z.object({
  account: z.string().min(1, "A account is required"),
  password: z.string().min(4, "A password is required"),
})

const configs = [
  { id: 1, field: "account", label: "Account" },
  { id: 2, field: "password", label: "Password" }
]

const setServerCookie = (responseHeaders: Headers) => {
  const responseCookies = typeof responseHeaders?.getSetCookie === "function"
    ? responseHeaders.getSetCookie()
    : [responseHeaders.get("set-cookie") ?? ""]

  if (responseCookies.length) for (const cookie of responseCookies) {
    setResponseHeader("Set-Cookie", cookie)
  }
}

export const loginActions = createServerFn()
  .inputValidator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    const response = await fetch("http://api.beones.tw/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const datas = await response.json()
    if (datas.status) setServerCookie(response.headers)

    return datas
  })


export const Route = createFileRoute("/(auths)/login/")({
  // ssr: false,
  // loader: async ({ context }) => {
  //   const data = await getCustomers({ data: { _acions: "read" } })
  //   if (!data?.status) return []
  //   return data
  // },
  component: LoginPage
})

function LoginPage() {
  const naviation = useNavigate()

  const submitHandler = async ({ value }: Record<string, any>) => {
    const { status, data } = await loginActions({ data: value })
    if (status) naviation({ to: "/" })
  }

  const form = useForm({
    defaultValues: configs.reduce(
      (initValue, field) => ({ ...initValue, [field.field]: "" }),
      {} as Record<string, any>
    ),
    validators: { onChange: schemas },
    validationLogic: revalidateLogic(),
    onSubmitInvalid() {
      const InvalidInput = document.querySelector('[aria-invalid="true"]') as HTMLInputElement
      InvalidInput?.focus()
    },
    onSubmit: submitHandler,
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
      {/* <AnimatePresence>
        {customersDatas.length && <motion.div initial={{ x: 0 }} animate={{ x: 100 }} >
          wade
        </motion.div>}
      </AnimatePresence> */}
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

