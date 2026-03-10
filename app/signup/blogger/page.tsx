import { Suspense } from "react"
import SignupBloggerClient from "./SignupBloggerClient"

export default function BloggerSignupPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">Loading...</div>}>
      <SignupBloggerClient />
    </Suspense>
  )
}
