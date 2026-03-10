"use client"

import { useEffect, useState } from "react"

export function ThemeScript() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function getTheme() {
                const theme = localStorage.getItem('vite-ui-theme');
                if (theme) return theme;
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              
              const theme = getTheme();
              document.documentElement.classList.toggle('dark', theme === 'dark');
              document.documentElement.style.colorScheme = theme;
            })();
          `,
        }}
      />
    )
  }

  return null
}
