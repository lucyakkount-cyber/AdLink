import { NextResponse } from "next/server"
import { withDb } from "@/lib/jsondb"
import { getAuthContext } from "@/lib/server/auth"

export async function GET() {
  const { authenticated, role } = await getAuthContext()
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "business") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const bloggers = await withDb((db) => {
    return db.users
      .filter((u) => u.role === "blogger")
      .map((u) => {
        const p = db.bloggerProfiles[String(u.id)]
        return {
          id: u.id,
          userId: u.id,
          email: u.email,
          username: p?.username ?? "",
          audience: p?.audience ?? null,
          price: p?.price ?? null,
          categories: p?.categories ?? [],
          targetAudiences: p?.targetAudiences ?? [],
          socials: p?.socials ?? [],
          avatar: p?.avatar,
          updatedAt: p?.updatedAt ?? null,
        }
      })
  })

  return NextResponse.json({ bloggers })
}
