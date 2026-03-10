"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MessageCircle, Instagram, Play } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface SearchFormProps {
  onSubmit: (data: {
    budgetMin: string
    budgetMax: string
    description: string
    goal: string
    platforms: string[]
  }) => void | Promise<void>
  isLoading: boolean
}

export function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const { tr } = useI18n()
  const [platforms, setPlatforms] = useState<string[]>([])
  const [budgetMin, setBudgetMin] = useState("")
  const [budgetMax, setBudgetMax] = useState("")

  // Format number with thousands separator for Uzbekistan
  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '').replace(/,/g, '')
    if (!cleanValue) return ''
    
    // Convert to number and format manually to ensure spaces
    const num = Number(cleanValue)
    if (isNaN(num)) return value
    
    // Manual formatting to ensure spaces instead of commas
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Handle budget input formatting
  const handleBudgetChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/,/g, '')
    if (!value || /^\d+$/.test(value)) {
      e.target.value = formatNumber(value)
      setter(e.target.value)
    }
  }

  const handlePlatformToggle = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit({
      budgetMin: (formData.get("budgetMin") as string).replace(/\s/g, '').replace(/,/g, ''),
      budgetMax: (formData.get("budgetMax") as string).replace(/\s/g, '').replace(/,/g, ''),
      description: formData.get("description") as string,
      goal: formData.get("goal") as string,
      platforms
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h2 className="mb-1 text-xl font-bold text-foreground">
        {tr("search.title")}
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {tr("search.subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="budgetMin" className="text-sm font-medium text-foreground">
              {tr("search.budget_min")}
            </Label>
            <Input
              id="budgetMin"
              name="budgetMin"
              type="text"
              placeholder="500 000"
              value={budgetMin}
              onChange={handleBudgetChange(setBudgetMin)}
              inputMode="numeric"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="budgetMax" className="text-sm font-medium text-foreground">
              {tr("search.budget_max")}
            </Label>
            <Input
              id="budgetMax"
              name="budgetMax"
              type="text"
              placeholder="1 000 000"
              value={budgetMax}
              onChange={handleBudgetChange(setBudgetMax)}
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-sm font-medium text-foreground">
            {tr("search.description")}
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder={tr("search.description_placeholder")}
            required
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="goal" className="text-sm font-medium text-foreground">
            {tr("search.goal")}
          </Label>
          <Select name="goal" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tr("search.goal_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">{tr("search.goal_sales")}</SelectItem>
              <SelectItem value="brand">{tr("search.goal_brand")}</SelectItem>
              <SelectItem value="customers">{tr("search.goal_customers")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-foreground">{tr("search.platforms")}</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Telegram', icon: MessageCircle, color: 'text-blue-500' },
              { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
              { name: 'TikTok', icon: Play, color: 'text-foreground' }
            ].map(({ name, icon: Icon, color }) => (
              <Button
                key={name}
                type="button"
                variant={platforms.includes(name) ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => handlePlatformToggle(name)}
              >
                <Icon className={`size-4 mr-1 ${platforms.includes(name) ? 'text-white' : color}`} />
                {name}
              </Button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-1 bg-blue-600 dark:bg-blue-500 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 dark:hover:bg-blue-600 gap-2"
        >
          <Search className="size-4" />
          {isLoading ? tr("search.loading") : tr("search.button")}
        </Button>
      </form>
    </div>
  )
}
