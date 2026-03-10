"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next")

  return (
    <div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Tizimga kirish
      </h1>
      <p className="mt-1 text-muted-foreground">
        Akkaunt turini tanlang va tizimga kiring
      </p>

      <div className="mt-8 space-y-4">
        <Link href={`/login/business${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="block">
          <Button 
            className="w-full bg-blue-600 dark:bg-blue-500 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 dark:hover:bg-blue-600 h-16 text-lg"
          >
            Biznes akkauntiga kirish
          </Button>
        </Link>

        <Link href={`/login/blogger${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="block">
          <Button 
            variant="outline"
            className="w-full border-2 border-border font-semibold text-foreground shadow-sm transition-all hover:bg-secondary h-16 text-lg"
          >
            Bloger akkauntiga kirish
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Akkauntingiz yo'qmi? {" "}
        <Link
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
        >
          Ro'yxatdan o'tish
        </Link>
      </p>
    </div>
  )
}
