import { Suspense } from "react"
import LoginClient from "./LoginClient"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">Loading...</div>}>
      <LoginClient />
    </Suspense>
  )
}
