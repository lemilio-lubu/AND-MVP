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
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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
