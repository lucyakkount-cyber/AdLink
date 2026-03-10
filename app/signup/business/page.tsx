import { Suspense } from "react"
import SignupBusinessClient from "./SignupBusinessClient"

export default function BusinessSignupPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">Loading...</div>}>
      <SignupBusinessClient />
    </Suspense>
  )
}
