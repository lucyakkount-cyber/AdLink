import { NextResponse } from "next/server"
import { withDb } from "@/lib/jsondb"
import { getAuthContext } from "@/lib/server/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("API: GET /api/bloggers/[id] called with params:", params)
  
  const { authenticated, role } = await getAuthContext()
  console.log("API: Auth context:", { authenticated, role })
  
  if (!authenticated) {
    console.log("API: Unauthorized - not authenticated")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "business") {
    console.log("API: Forbidden - not business role, role:", role)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const bloggerId = params.id
  console.log("API: Looking for bloggerId:", bloggerId)

  if (!bloggerId) {
    return NextResponse.json({ error: "Blogger ID is required" }, { status: 400 })
  }

  try {
    const result = await withDb((db) => {
      console.log("API: Database users:", db.users.map(u => ({ id: u.id, email: u.email, role: u.role })))
      console.log("API: Database bloggerProfiles keys:", Object.keys(db.bloggerProfiles))
      
      const user = db.users.find(u => u.id === parseInt(bloggerId) && u.role === "blogger")
      console.log("API: Found user:", user)
      
      if (!user) {
        console.log("API: Blogger not found")
        return {
          ok: false as const,
          error: "Blogger not found",
        }
      }

      const profile = db.bloggerProfiles[bloggerId]
      console.log("API: Found profile:", profile)
      
      if (!profile) {
        console.log("API: Blogger profile not found for key:", bloggerId)
        return {
          ok: false as const,
          error: "Blogger profile not found",
        }
      }

      console.log("API: Returning profile successfully")
      return {
        ok: true as const,
        profile: {
          userId: user.id,
          email: user.email,
          username: profile.username,
          audience: profile.audience,
          price: profile.price,
          categories: profile.categories || [],
          targetAudiences: profile.targetAudiences || [],
          socials: profile.socials,
          avatar: profile.avatar,
          updatedAt: profile.updatedAt,
        }
      }
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching blogger profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
