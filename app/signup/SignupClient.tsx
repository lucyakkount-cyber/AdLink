"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export default function SignupClient() {
  const searchParams = useSearchParams()
  const { tr } = useI18n()

  const next = searchParams.get("next")

  return (
    <div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Ro‘yxatdan o‘tish
      </h1>
      <p className="mt-1 text-muted-foreground">
        Akkaunt turini tanlang va ro‘yxatdan o‘ting
      </p>

      <div className="mt-8 space-y-4">
        <Link href="/signup/business" className="block">
          <Button 
            className="w-full bg-blue-600 dark:bg-blue-500 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 dark:hover:bg-blue-600 h-16 text-lg"
          >
            Biznes akkauntini ochish
          </Button>
        </Link>

        <Link href="/signup/blogger" className="block">
          <Button 
            variant="outline"
            className="w-full border-2 border-border font-semibold text-foreground shadow-sm transition-all hover:bg-secondary h-16 text-lg"
          >
            Bloger profili yaratish
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Akkauntingiz bormi? {" "}
        <Link
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
        >
          Kirish
        </Link>
      </p>
    </div>
  )
}
