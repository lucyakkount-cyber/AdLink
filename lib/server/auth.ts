import { cookies } from "next/headers"
import { withDb } from "../jsondb"

export type AuthContext = {
  authenticated: boolean
  role: string | null
  userId: number | null
  email: string | null
}

export async function getAuthContext(): Promise<AuthContext> {
  const store = await cookies()
  const authenticated = store.get("adlink_auth")?.value === "1"
  const role = store.get("adlink_role")?.value ?? null
  const uid = store.get("adlink_uid")?.value
  const userId = uid ? Number(uid) : null

  let email: string | null = null
  if (authenticated && userId) {
    email = await withDb((db: any) => {
      const user = db.users.find((u: any) => u.id === userId)
      return user?.email ?? null
    })
  }

  return { authenticated, role, userId, email }
}
