import { Suspense } from "react"
import BusinessLoginClient from "./LoginClient"

export default function BusinessLoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">Loading...</div>}>
      <BusinessLoginClient />
    </Suspense>
  )
}
