import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const store = await cookies()
  const auth = store.get("adlink_auth")?.value
  const role = store.get("adlink_role")?.value
  const uid = store.get("adlink_uid")?.value

  const authenticated = auth === "1"

  return NextResponse.json(
    {
      authenticated,
      role: authenticated ? role || null : null,
      userId: authenticated ? (uid ? Number(uid) : null) : null,
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    }
  )
}
