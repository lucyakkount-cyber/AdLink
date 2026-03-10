import { randomBytes, pbkdf2Sync, timingSafeEqual } from "crypto"

const ITERATIONS = 120_000
const KEYLEN = 32
const DIGEST = "sha256"

export type UserRole = "business" | "blogger"

export function isUserRole(value: unknown): value is UserRole {
  return value === "business" || value === "blogger"
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString(
    "hex"
  )
  return `pbkdf2$${ITERATIONS}$${salt}$${derived}`
}

export function verifyPassword(password: string, stored: string) {
  const parts = stored.split("$")
  if (parts.length !== 4) return false
  const [, iterStr, salt, hashHex] = parts
  const iterations = Number(iterStr)
  if (!Number.isFinite(iterations) || iterations <= 0) return false

  const derived = pbkdf2Sync(password, salt, iterations, KEYLEN, DIGEST)
  const storedBuf = Buffer.from(hashHex, "hex")
  if (storedBuf.length !== derived.length) return false
  return timingSafeEqual(storedBuf, derived)
}
