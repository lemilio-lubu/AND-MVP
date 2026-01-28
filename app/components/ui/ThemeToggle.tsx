"use client"

import * as React from "react"
import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] dark:bg-[var(--surface)] dark:text-[var(--foreground)] hover:bg-[var(--primary)]/20 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={20} weight="bold" />
      ) : (
        <Moon size={20} weight="bold" />
      )}
    </button>
  )
}
