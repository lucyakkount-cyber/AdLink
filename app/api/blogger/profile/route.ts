import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/server/auth"
import { withDb } from "@/lib/jsondb"

export async function GET() {
  const { authenticated, role, userId, email } = await getAuthContext()
  if (!authenticated || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "blogger") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = await withDb((db) => {
    const profile = db.bloggerProfiles[String(userId)]
    if (profile) {
      return { ...profile, email }
    } else {
      return {
        userId,
        email,
        username: "",
        audience: null,
        price: null,
        categories: ["Barchasi"],
        targetAudiences: ["Barchasi"],
        socials: [],
        avatar: "",
        regions: [], // Add regions field
        updatedAt: new Date().toISOString(),
      }
    }
  })
  
  return NextResponse.json({ profile: data })
}

export async function POST(request: Request) {
  const { authenticated, role, userId } = await getAuthContext()
  if (!authenticated || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "blogger") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as
    | {
        username?: string
        audience?: number
        price?: number
        categories?: string[]
        targetAudiences?: string[]
        socials?: string[]
        avatar?: string
        regions?: string[] // Add regions field
      }
    | null

  const profile = {
    userId,
    username: body?.username ?? "",
    audience: typeof body?.audience === "number" ? body.audience : null,
    price: typeof body?.price === "number" ? body.price : null,
    categories: Array.isArray(body?.categories) ? body.categories : ["Barchasi"],
    targetAudiences: Array.isArray(body?.targetAudiences) ? body.targetAudiences : ["Barchasi"],
    socials: Array.isArray(body?.socials) ? body.socials : [],
    avatar: body?.avatar ?? "",
    regions: Array.isArray(body?.regions) ? body.regions : [], // Add regions field
    updatedAt: new Date().toISOString(),
  }

  await withDb((db) => {
    db.bloggerProfiles[String(userId)] = profile
  })

  return NextResponse.json({ ok: true })
}
