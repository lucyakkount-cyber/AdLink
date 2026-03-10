import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set("adlink_auth", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 })
  response.cookies.set("adlink_role", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 })
  response.cookies.set("adlink_uid", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 })
  return response
}
