"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  MessageCircle,
  Instagram,
  Play,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface BloggerCardProps {
  name: string
  initials: string
  audience: string
  price: string
  socials: string[]
  aiText: string
  avatar?: string
  userId?: number
}

const socialIcons: Record<string, { icon: typeof MessageCircle; color: string }> = {
  Telegram: { icon: MessageCircle, color: "text-blue-500" },
  Instagram: { icon: Instagram, color: "text-pink-500" },
  TikTok: { icon: Play, color: "text-foreground" },
}

export function BloggerCard({
  name,
  initials,
  audience,
  price,
  socials,
  aiText,
  avatar,
  userId,
}: BloggerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const { tr } = useI18n()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const CardContent = () => (
    <div className="group rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5">
      <div className="flex items-start gap-4">
        <Avatar className="size-12 border border-blue-100 dark:border-blue-900">
          {avatar && avatar.startsWith('data:') ? (
            <img 
              src={avatar} 
              alt={`${name} avatar`} 
              className="size-full object-cover rounded-full"
              onError={(e) => {
                console.error(`Failed to load avatar for ${name}:`, e);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log(`Avatar loaded successfully for ${name}`);
              }}
            />
          ) : (
            <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0 flex-1">
          <Link 
            href={`/business/dashboard/profile/${userId}`}
            className="truncate font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {name}
          </Link>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-600 dark:text-blue-400"
            >
              {audience}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-secondary text-xs text-muted-foreground"
            >
              {price}
            </Badge>
          </div>
        </div>
      </div>

      {/* Social icons */}
      <div className="mt-4 flex items-center gap-3">
        {socials.map((social) => {
          const s = socialIcons[social]
          if (!s) return null
          return (
            <div
              key={social}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <s.icon className={`size-4 ${s.color}`} />
              <span>{social}</span>
            </div>
          )
        })}
      </div>

      {!!aiText && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between rounded-lg bg-secondary/70 dark:bg-gray-800/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary dark:hover:bg-gray-800"
          >
            <span className="font-medium text-foreground">{tr("card.ai_text")}</span>
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
          {expanded && (
            <div className="mt-2 rounded-lg bg-secondary/50 dark:bg-gray-800/50 p-3">
              <p className="text-sm leading-relaxed text-muted-foreground">{aiText}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="mt-2 h-8 gap-1.5 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    {tr("card.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    {tr("card.copy")}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Learn More Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Link 
          href={`/business/dashboard/profile/${userId}`}
          className="block"
        >
          <Button 
            variant="outline" 
            className="w-full justify-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-800 dark:hover:text-blue-400"
          >
            {tr("card.learn_more") || "Learn More"}
            <ChevronDown className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  )

  return <CardContent />
}
