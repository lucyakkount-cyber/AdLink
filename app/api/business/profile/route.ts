import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/server/auth"
import { withDb } from "@/lib/jsondb"

export async function GET() {
  const { authenticated, role, userId } = await getAuthContext()
  if (!authenticated || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "business") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = await withDb((db) => db.businessProfiles[String(userId)] ?? null)
  return NextResponse.json(
    data ?? {
      companyName: "",
      niche: "",
      budgetMin: null,
      budgetMax: null,
    }
  )
}

export async function POST(request: Request) {
  const { authenticated, role, userId } = await getAuthContext()
  if (!authenticated || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "business") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as
    | {
        companyName?: string
        email?: string
        niche?: string
        budgetMin?: number
        budgetMax?: number
        description?: string
      }
    | null

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const profile = {
    userId,
    companyName: body.companyName ?? "",
    email: body.email ?? "",
    niche: body.niche ?? "",
    budgetMin: typeof body.budgetMin === "number" ? body.budgetMin : null,
    budgetMax: typeof body.budgetMax === "number" ? body.budgetMax : null,
    description: body.description ?? "",
    updatedAt: new Date().toISOString(),
  }

  await withDb((db) => {
    db.businessProfiles[String(userId)] = profile
  })

  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  const { authenticated, role, userId } = await getAuthContext()
  if (!authenticated || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "business") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as
    | {
        companyName?: string
        niche?: string
        budgetMin?: number
        budgetMax?: number
        description?: string
      }
    | null

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const profile = {
    userId,
    companyName: body.companyName ?? "",
    niche: body.niche ?? "",
    budgetMin: typeof body.budgetMin === "number" ? body.budgetMin : null,
    budgetMax: typeof body.budgetMax === "number" ? body.budgetMax : null,
    description: body.description ?? "",
    updatedAt: new Date().toISOString(),
  }

  await withDb((db) => {
    db.businessProfiles[String(userId)] = profile
  })

  return NextResponse.json(profile)
}
