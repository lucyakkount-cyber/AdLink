import { NextResponse } from "next/server"
import { verifyPassword } from "@/lib/auth"
import { withDb } from "@/lib/jsondb"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null

  const email = body?.email?.trim()
  const password = body?.password

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  const user = await withDb((db) =>
    db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  )

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const ok = verifyPassword(password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set("adlink_auth", "1", { httpOnly: true, sameSite: "lax", path: "/" })
  response.cookies.set("adlink_role", user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })
  response.cookies.set("adlink_uid", String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  return response
}
