import { existsSync } from "fs"
import { mkdir, readFile, writeFile } from "fs/promises"
import { dirname } from "path"
import { join } from "path"
import type { UserRole } from "@/lib/auth"

export type UserRow = {
  id: number
  email: string
  passwordHash: string
  role: UserRole
  createdAt: string
}

export type BloggerProfileRow = {
  userId: number
  username: string
  audience: number | null
  price: number | null
  categories: string[]
  targetAudiences: string[]
  socials: string[]
  avatar?: string
  regions?: string[] // Add regions field
  updatedAt: string
}

export type BusinessProfileRow = {
  userId: number
  companyName: string
  niche: string
  budgetMin: number | null
  budgetMax: number | null
  updatedAt: string
}

export type CampaignRow = {
  id: number
  businessUserId: number
  bloggerUserId: number
  platform: string | null
  price: number | null
  status: string
  message: string | null
  createdAt: string
  updatedAt: string
}

export type OrderNotificationRow = {
  id: string
  businessId: number
  businessName: string
  businessEmail: string
  bloggerId: number
  bloggerUsername: string
  bloggerEmail: string
  message: string
  budget: number | null
  productCategory: string
  description: string
  createdAt: string
  status: "pending" | "accepted" | "rejected"
  updatedAt?: string
}

export type JsonDb = {
  meta: {
    nextUserId: number
    nextCampaignId: number
  }
  users: UserRow[]
  bloggerProfiles: Record<string, BloggerProfileRow>
  businessProfiles: Record<string, BusinessProfileRow>
  campaigns: CampaignRow[]
  orderNotifications: Record<string, OrderNotificationRow>
  kv: Record<string, unknown>
}

const DB_FILE = join(process.cwd(), "data", "db.json")

const EMPTY_DB: JsonDb = {
  meta: { nextUserId: 1, nextCampaignId: 1 },
  users: [],
  bloggerProfiles: {},
  businessProfiles: {},
  campaigns: [],
  orderNotifications: {},
  kv: {},
}

let mutex: Promise<void> = Promise.resolve()

async function ensureFile() {
  if (existsSync(DB_FILE)) return
  await mkdir(dirname(DB_FILE), { recursive: true })
  await writeFile(DB_FILE, JSON.stringify(EMPTY_DB, null, 2), "utf8")
}

async function readDb(): Promise<JsonDb> {
  await ensureFile()
  const text = await readFile(DB_FILE, "utf8")
  try {
    return JSON.parse(text) as JsonDb
  } catch {
    return structuredClone(EMPTY_DB)
  }
}

async function writeDb(db: JsonDb) {
  await mkdir(dirname(DB_FILE), { recursive: true })
  await writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8")
}

export async function withDb<T>(fn: (db: JsonDb) => T | Promise<T>): Promise<T> {
  let release: () => void = () => {}
  const prev = mutex
  mutex = new Promise<void>((r) => {
    release = r
  })
  await prev

  try {
    const db = await readDb()
    const result = await fn(db)
    await writeDb(db)
    return result
  } finally {
    release()
  }
}
