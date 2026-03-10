import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const isProtected =
    pathname === "/profile" ||
    pathname === "/business" ||
    pathname.startsWith("/business/") ||
    pathname === "/blogger" ||
    pathname.startsWith("/blogger/")

  if (!isProtected) {
    return NextResponse.next()
  }

  const isAuthed = request.cookies.get("adlink_auth")?.value === "1"
  const role = request.cookies.get("adlink_role")?.value

  if (!isAuthed || !role) {
    const url = request.nextUrl.clone()
    url.pathname = "/signup"
    url.searchParams.set("reason", "account_required")
    url.searchParams.set("next", pathname + search)
    return NextResponse.redirect(url)
  }

  const isBusinessPath = pathname === "/business" || pathname.startsWith("/business/")
  const isBloggerPath = pathname === "/blogger" || pathname.startsWith("/blogger/")

  if (role === "business" && isBloggerPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/business/dashboard"
    return NextResponse.redirect(url)
  }

  if (role === "blogger" && isBusinessPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/blogger/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/business/:path*", "/blogger/:path*", "/profile"],
}
