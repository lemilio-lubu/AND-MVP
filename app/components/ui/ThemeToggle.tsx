"use client"

import * as React from "react"
import { Circle, Sparkle } from "@phosphor-icons/react"
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
      aria-label="Toggle texture mode"
      title={theme === "dark" ? "Activar Texturas" : "Desactivar Texturas"}
    >
      {theme === "dark" ? (
        <Sparkle size={20} weight="fill" />
      ) : (
        <Circle size={20} weight="fill" />
      )}
    </button>
  )
}
