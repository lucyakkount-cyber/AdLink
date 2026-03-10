import { NextResponse } from "next/server"
import { hashPassword, isUserRole, type UserRole } from "@/lib/auth"
import { withDb } from "@/lib/jsondb"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; role?: UserRole }
    | null

  const email = body?.email?.trim()
  const password = body?.password
  const role = body?.role

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "Email, password, and role are required" },
      { status: 400 }
    )
  }

  if (!isUserRole(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  const passwordHash = hashPassword(password)

  const result = await withDb((db) => {
    const exists = db.users.some((u) => 
      u.email.toLowerCase() === email.toLowerCase() && u.role === role
    )
    if (exists) {
      return {
        ok: false as const,
        status: 409 as const,
        error: `An account with this email already exists for ${role} role`,
      }
    }

    const id = db.meta.nextUserId++
    db.users.push({
      id,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    })

    return { ok: true as const, id }
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set("adlink_auth", "1", { httpOnly: true, sameSite: "lax", path: "/" })
  response.cookies.set("adlink_role", role, { httpOnly: true, sameSite: "lax", path: "/" })
  response.cookies.set("adlink_uid", String(result.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  return response
}
