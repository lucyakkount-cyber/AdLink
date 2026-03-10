import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeScript } from "@/components/theme-script"
import { ChatWidget } from "@/components/chat-widget"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "AdLink \u2014 AI bilan biznes va blogerlar platformasi | Telegram, Instagram, TikTok reklama",
  description: "O'zbekistonning birinchi AI platformasi! Biznes uchun blogerlarni toping, reklama postlarini yarating. Telegram, Instagram, TikTok bloggerlari bilan hamkorlik. Tez, samarali, arzon.",
  keywords: [
    "bloger",
    "reklama", 
    "AI",
    "Telegram",
    "Instagram", 
    "TikTok",
    "O'zbekiston",
    "biznes",
    "influencer",
    "marketing",
    "reklama agentligi",
    "bloger topish",
    "AI reklama",
    "inflyuenser marketing",
    "sosial media marketing",
    "Toshkent",
    "blogger O'zbekiston",
    "reklama yaratish",
    "biznes reklama",
    "digital marketing"
  ],
  authors: [{ name: "AdLink Team" }],
  creator: "AdLink",
  publisher: "AdLink",
  metadataBase: new URL("https://adlink.uz"),
  alternates: {
    canonical: "https://adlink.uz",
    languages: {
      'uz-UZ': 'https://adlink.uz/uz',
      'ru-RU': 'https://adlink.uz/ru',
    },
  },
  openGraph: {
    title: "AdLink \u2014 AI bilan biznes va blogerlar platformasi",
    description: "O'zbekistonning birinchi AI platformasi! Biznes uchun blogerlarni toping, reklama postlarini yarating. Telegram, Instagram, TikTok bloggerlari bilan hamkorlik.",
    url: "https://adlink.uz",
    siteName: "AdLink",
    locale: "uz_UZ",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AdLink - AI blogger platformasi",
      },
      {
        url: "/og-image-square.jpg",
        width: 800,
        height: 800,
        alt: "AdLink - AI blogger platformasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdLink \u2014 AI bilan biznes va blogerlar platformasi",
    description: "O'zbekistonning birinchi AI platformasi! Biznes uchun blogerlarni toping, reklama postlarini yarating.",
    images: ["/og-image.jpg"],
    creator: "@adlinkuz",
    site: "@adlinkuz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
  },
  category: "technology",
  classification: "Marketing Platform",
  referrer: "origin-when-cross-origin",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AdLink",
              "alternateName": "AdLink - AI blogger platformasi",
              "url": "https://adlink.uz",
              "description": "O'zbekistonning birinchi AI platformasi! Biznes uchun blogerlarni toping, reklama postlarini yarating. Telegram, Instagram, TikTok bloggerlari bilan hamkorlik.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://adlink.uz/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/adlinkuz",
                "https://instagram.com/adlinkuz",
                "https://facebook.com/adlinkuz",
                "https://telegram.me/adlinkuz"
              ],
              "mainEntity": {
                "@type": "Organization",
                "name": "AdLink",
                "url": "https://adlink.uz",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://adlink.uz/logo.png",
                  "width": 512,
                  "height": 512
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+998-XX-XXX-XX-XX",
                  "contactType": "customer service",
                  "availableLanguage": ["Uzbek", "Russian", "English"]
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "UZ",
                  "addressLocality": "Tashkent"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 41.2995,
                  "longitude": 69.2401
                },
                "openingHours": "Mo-Fr 09:00-18:00",
                "areaServed": "Uzbekistan"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AdLink",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://adlink.uz/logo.png"
                }
              },
              "dateModified": new Date().toISOString(),
              "inLanguage": "uz-UZ",
              "isAccessibleForFree": true,
              "isPartOf": {
                "@type": "WebSite",
                "name": "AdLink",
                "url": "https://adlink.uz"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AdLink",
              "applicationCategory": "MarketingPlatform",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "UZS",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-01-01"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Organization",
                "name": "AdLink Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AdLink"
              },
              "datePublished": "2026-01-01",
              "dateModified": "2026-01-01"
            })
          }}
        />
        <ThemeScript />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <div className="size-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Demo Versiya - Sayt test rejimida ishlamoqda</span>
          </div>
        </div>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
