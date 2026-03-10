import { NextResponse } from "next/server"
import { withDb } from "@/lib/jsondb"
import { getAuthContext } from "@/lib/server/auth"

interface BloggerProfile {
  userId: number
  email: string
  username: string
  audience: number | null
  price: number | null
  categories: string[]
  targetAudiences: string[]
  socials: string[]
  updatedAt: string
  avatar?: string // Optional avatar
  regions?: string[] // Optional regions
}

interface AIMatchRequest {
  productCategory: string
  targetAudience: string
  budget: {
    min: number
    max: number
  }
  description: string
  platforms: string[]
  region?: string // Optional region filter
}

interface AIMatchResult {
  blogger: BloggerProfile
  matchScore: number
  reasons: string[]
  estimatedReach: number
  estimatedCost: number
}

// Advanced AI matching algorithm
function calculateMatchScore(
  blogger: BloggerProfile,
  request: AIMatchRequest
): { score: number; reasons: string[] } {
  const reasons: string[] = []
  let score = 0

  // Enhanced Category matching (30% weight - reduced from 35%)
  const bloggerCategories = blogger.categories || []
  const productCategory = request.productCategory.toLowerCase()
  const productDescription = request.description.toLowerCase()
  
  // Direct category match - check if any blogger category matches
  const directMatch = bloggerCategories.some(cat => {
    const bloggerCat = cat.toLowerCase()
    return bloggerCat.includes(productCategory) || productCategory.includes(bloggerCat)
  })
  
  if (directMatch) {
    score += 30  // Reduced from 35
    reasons.push(`Kategoriya to'liq mos: ${bloggerCategories.join(", ")}`)
  } 
  // Partial category match
  else if (bloggerCategories.some(cat => {
    const bloggerCat = cat.toLowerCase()
    return bloggerCat.includes(productCategory.split(' ')[0]) || 
           productCategory.includes(bloggerCat.split(' ')[0])
  })) {
    score += 20  // Reduced from 25
    reasons.push(`Kategoriya qisman mos: ${bloggerCategories.join(", ")}`)
  }
  // Description-based matching
  else if (productDescription && bloggerCategories.some(cat => {
    const bloggerCat = cat.toLowerCase()
    return bloggerCat.includes(productDescription.split(' ')[0]) ||
           productDescription.includes(bloggerCat.split(' ')[0])
  })) {
    score += 10  // Reduced from 15
    reasons.push(`Tavsif asosida mos: ${bloggerCategories.join(", ")}`)
  }
  // Business/General category matching
  else if (bloggerCategories.some(cat => cat.toLowerCase().includes("biznes") || cat.toLowerCase().includes("yangi") || cat.toLowerCase().includes("startap"))) {
    if (productCategory.includes("biznes") || productCategory.includes("startap") || 
        productDescription.includes("biznes") || productDescription.includes("startap")) {
      score += 25  // Reduced from 30
      reasons.push(`Biznes yo'nalishiga mos: ${bloggerCategories.join(", ")}`)
    } else {
      score += 8   // Reduced from 15
      reasons.push(`Umumiy biznes blogger: ${bloggerCategories.join(", ")}`)
    }
  }

  // Audience size matching (15% weight - reduced from 20%)
  const audience = blogger.audience || 0
  if (audience >= 100000) {
    score += 15  // Reduced from 20
    reasons.push(`Juda katta obunachi bazasi: ${(audience / 1000).toFixed(0)}K+`)
  } else if (audience >= 50000) {
    score += 12  // Reduced from 18
    reasons.push(`Katta obunachi bazasi: ${(audience / 1000).toFixed(0)}K+`)
  } else if (audience >= 25000) {
    score += 10  // Reduced from 15
    reasons.push(`Yaxshi obunachi bazasi: ${(audience / 1000).toFixed(0)}K+`)
  } else if (audience >= 10000) {
    score += 6   // Reduced from 10
    reasons.push(`O'rtacha obunachi bazasi: ${(audience / 1000).toFixed(0)}K+`)
  } else if (audience >= 5000) {
    score += 3   // Reduced from 10 (was 10, now 3)
    reasons.push(`Kichik obunachi bazasi: ${(audience / 1000).toFixed(0)}K+`)
  }

  // Smart Price matching (20% weight - reduced from 25%)
  const price = blogger.price || 0
  const budgetMin = request.budget.min
  const budgetMax = request.budget.max
  const budgetRange = budgetMax - budgetMin
  
  if (price >= budgetMin && price <= budgetMax) {
    score += 20  // Reduced from 25
    reasons.push(`Byudjetga to'liq mos: ${price.toLocaleString("uz-UZ")} so'm`)
  } else if (price < budgetMin) {
    // Cheaper than budget - still good
    const diff = budgetMin - price
    if (diff <= budgetRange * 0.2) {  // Tighter threshold
      score += 15  // Reduced from 20
      reasons.push(`Byudjetdan arzon: ${price.toLocaleString("uz-UZ")} so'm`)
    } else if (diff <= budgetRange * 0.4) {
      score += 10  // Reduced from 15
      reasons.push(`Biroz arzon: ${price.toLocaleString("uz-UZ")} so'm`)
    } else {
      score += 5   // Reduced from 15
      reasons.push(`Juda arzon: ${price.toLocaleString("uz-UZ")} so'm`)
    }
  } else if (price > budgetMax) {
    // More expensive than budget
    const diff = price - budgetMax
    if (diff <= budgetRange * 0.1) {  // Tighter threshold
      score += 8   // Reduced from 10
      reasons.push(`Byudjetdan biroz qimmat: ${price.toLocaleString("uz-UZ")} so'm`)
    }
    // If too expensive, don't add score
  }

  // Enhanced Platform matching (10% weight - reduced from 15%)
  const bloggerPlatforms = blogger.socials.map(s => s.split(':')[0].toLowerCase().trim())
  const requestedPlatforms = request.platforms.map(p => p.toLowerCase().trim())
  
  if (requestedPlatforms.length === 0) {
    // No platform preference - give points for having any platforms
    if (bloggerPlatforms.length >= 2) {
      score += 10  // Reduced from 15
      reasons.push(`Ko'p platformalar: ${bloggerPlatforms.join(", ")}`)
    } else if (bloggerPlatforms.length >= 1) {
      score += 6   // Reduced from 10
      reasons.push(`Platforma mavjud: ${bloggerPlatforms.join(", ")}`)
    }
  } else {
    const matchingPlatforms = bloggerPlatforms.filter(p => 
      requestedPlatforms.some(rp => rp === p)
    )
    
    if (matchingPlatforms.length === requestedPlatforms.length) {
      score += 10  // Reduced from 15
      reasons.push(`Barcha platformalar mos: ${matchingPlatforms.join(", ")}`)
    } else if (matchingPlatforms.length > 0) {
      score += 5   // Reduced from 10
      reasons.push(`Qisman platformalar mos: ${matchingPlatforms.join(", ")}`)
    }
  }

  // More inclusive audience matching with lower thresholds (5% weight - reduced from 10%)
  if (request.targetAudience) {
    const targetAudience = request.targetAudience.toLowerCase()
    const bloggerTargetAudiences = blogger.targetAudiences || []
    
    // Match "Barchasi" audience - matches with any blogger
    if (targetAudience === "barchasi") {
      score += 3   // Reduced from 5
      reasons.push("Barcha auditoriyalar mos")
    } else if (bloggerTargetAudiences.some(aud => aud.toLowerCase().includes(targetAudience))) {
      score += 5   // Reduced from 10
      reasons.push(`Target auditoriya to'liq mos: ${bloggerTargetAudiences.join(", ")}`)
    } else if (targetAudience.includes("18-25") && audience >= 5000) {  // Higher threshold
      score += 3   // Reduced from 5
      reasons.push("Yosh auditoriyaga mos")
    } else if (targetAudience.includes("talaba") && audience >= 5000) {  // Higher threshold
      score += 3   // Reduced from 5
      reasons.push("Talabalarga mos")
    } else if (targetAudience.includes("ishchi") && audience >= 5000) {  // Higher threshold
      score += 3   // Reduced from 5
      reasons.push("Ishchi auditoriyaga mos")
    } else if (targetAudience.includes("ayol") && audience >= 5000) {  // Higher threshold
      score += 3   // Reduced from 5
      reasons.push("Ayol auditoriyaga mos")
    } else if (targetAudience.includes("yosh") && audience >= 5000) {  // Higher threshold
      score += 3   // Reduced from 5
      reasons.push("Yosh auditoriyaga mos")
    } else if (targetAudience.includes("biznes") && audience >= 5000) {  // Higher threshold
      score += 3   // Reduced from 5
      reasons.push("Biznes auditoriyaga mos")
    } else if (targetAudience.includes("barcha") || targetAudience.includes("hamma")) {
      score += 2   // Reduced from 3
      reasons.push("Umumiy auditoriya")
    } else {
      // Include all audiences with basic score
      score += 1   // Reduced from 2
      reasons.push("Auditoriya mos")
    }
  }

  // Region matching (5% weight - reduced from 10%)
  if (request.region && blogger.regions && blogger.regions.length > 0) {
    const bloggerRegions = blogger.regions.map(r => r.toLowerCase().trim())
    const requestedRegion = request.region.toLowerCase().trim()
    
    if (requestedRegion === "random") {
      // Random region - give points to all bloggers with regions
      score += 5   // Reduced from 10
      reasons.push("Ixtiyoriy hudud: Random tanlov")
    } else if (bloggerRegions.includes(requestedRegion)) {
      score += 5   // Reduced from 10
      reasons.push(`Hudud to'liq mos: ${request.region}`)
    }
  }

  return { score: Math.min(score, 100), reasons }
}

export async function POST(request: Request) {
  const { authenticated, role } = await getAuthContext()
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (role !== "business") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body: AIMatchRequest = await request.json()
    
    // Validate request
    if (!body.productCategory || !body.targetAudience || !body.budget) {
      return NextResponse.json({ 
        error: "Missing required fields: productCategory, targetAudience, budget" 
      }, { status: 400 })
    }

    // Get all bloggers
    const bloggers = await withDb((db) => {
      return db.users
        .filter((u) => u.role === "blogger")
        .map((u) => {
          const p = db.bloggerProfiles[String(u.id)]
          if (!p) return null
          
          return {
            userId: u.id,
            email: u.email,
            username: p.username,
            audience: p.audience,
            price: p.price,
            categories: p.categories || [],
            targetAudiences: p.targetAudiences || [],
            socials: p.socials || [],
            avatar: p.avatar,
            regions: p.regions || [], // Add regions field
            updatedAt: p.updatedAt,
          }
        })
        .filter(Boolean)
    })

    // Calculate match scores for all bloggers
    const matches: AIMatchResult[] = bloggers
      .filter((blogger) => blogger !== null) // Filter out null bloggers
      .filter((blogger) => {
        // Strict filtering: only include bloggers that meet ALL criteria
        const bloggerData = blogger as BloggerProfile
        
        // Category filtering - must match category
        const bloggerCategories = bloggerData.categories || []
        const productCategory = body.productCategory.toLowerCase().trim()
        const productDescription = body.description.toLowerCase().trim()
        
        let categoryMatch = false
        
        // More inclusive category matching
        // 1. Direct category match - check if any blogger category matches product category
        if (bloggerCategories.some(cat => {
          const bloggerCat = cat.toLowerCase().trim()
          return bloggerCat.includes(productCategory) || productCategory.includes(bloggerCat)
        })) {
          categoryMatch = true
        } 
        // 2. Partial category match
        else if (bloggerCategories.some(cat => {
          const bloggerCat = cat.toLowerCase().trim()
          return bloggerCat.includes(productCategory.split(' ')[0]) || 
                 productCategory.includes(bloggerCat.split(' ')[0])
        })) {
          categoryMatch = true
        }
        // 3. Description-based matching
        else if (productDescription && bloggerCategories.some(cat => {
          const bloggerCat = cat.toLowerCase().trim()
          return bloggerCat.includes(productDescription.split(' ')[0]) ||
                 productDescription.includes(bloggerCat.split(' ')[0])
        })) {
          categoryMatch = true
        }
        // 4. Business/General category matching
        else if (bloggerCategories.some(cat => {
          const bloggerCat = cat.toLowerCase().trim()
          return bloggerCat.includes("biznes") || bloggerCat.includes("yangi") || bloggerCat.includes("startap")
        })) {
          if (productCategory.includes("biznes") || productCategory.includes("startap") || 
              productDescription.includes("biznes") || productDescription.includes("startap")) {
            categoryMatch = true
          }
        }
        // 5. Include all bloggers for broad searches
        else if (productCategory === "" || productCategory.length < 3) {
          categoryMatch = true
        }
        // 6. Include specific blogger categories
        else if (bloggerCategories.some(cat => cat.toLowerCase().trim() === "tursunboy")) {
          categoryMatch = true
        }
        // 7. Match based on common keywords
        else {
          const commonKeywords = [
            "texno", "moda", "go'zal", "oziq", "ta'lim", "biznes", "startap",
            "sog'liq", "sport", "uy", "qurilish", "avtomobil", "transport", 
            "sayohat", "turizm", "bozor", "savdo", "xizmat", "konsalting",
            "o'yinchoq", "bola", "kiyim", "kechak", "aksessuar", "parfyumeriya",
            "elektronika", "jihoz", "gadjet"
          ]
          const hasCommonKeyword = bloggerCategories.some(cat => {
            const bloggerCat = cat.toLowerCase().trim()
            return commonKeywords.some(keyword => 
              bloggerCat.includes(keyword) || productCategory.includes(keyword)
            )
          })
          if (hasCommonKeyword) {
            categoryMatch = true
          }
        }
        
        // 8. Match "Barchasi" category - matches with any blogger
        if (productCategory === "Barchasi") {
          categoryMatch = true
        }
        
        if (!categoryMatch) {
          return false
        }
        
        // Budget filtering - must be within budget range
        const price = bloggerData.price || 0
        if (price < body.budget.min || price > body.budget.max) {
          return false
        }
        
        // Platform filtering - must have at least one requested platform
        if (body.platforms.length > 0) {
          const bloggerPlatforms = bloggerData.socials.map(s => s.split(':')[0].toLowerCase().trim())
          const requestedPlatforms = body.platforms.map(p => p.toLowerCase().trim())
          const hasMatchingPlatform = bloggerPlatforms.some(bp => 
            requestedPlatforms.some(rp => rp === bp)
          )
          if (!hasMatchingPlatform) {
            return false
          }
        }
        
        // Region filtering - must match region if not random
        if (body.region && body.region !== "random" && bloggerData.regions && bloggerData.regions.length > 0) {
          const bloggerRegions = bloggerData.regions.map(r => r.toLowerCase().trim())
          const requestedRegion = body.region.toLowerCase().trim()
          if (!bloggerRegions.includes(requestedRegion)) {
            return false
          }
        }
        
        return true
      })
      .map((blogger) => {
        const { score, reasons } = calculateMatchScore(blogger as BloggerProfile, body)
        return {
          blogger: blogger as BloggerProfile,
          matchScore: score,
          reasons,
          estimatedReach: blogger.audience || 0,
          estimatedCost: blogger.price || 0
        }
      })
      .filter(match => match.matchScore > 10) // Show matches with 10%+ score (more inclusive)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15) // Top 15 matches (more options)

    return NextResponse.json({
      matches,
      totalFound: matches.length,
      searchCriteria: body
    })

  } catch (error) {
    console.error("AI matching error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
