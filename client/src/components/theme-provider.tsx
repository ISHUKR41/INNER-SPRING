/**
 * Theme Provider Component for MindCare Application
 * 
 * This component provides theme context throughout the application using next-themes.
 * It enables light/dark mode toggling with system preference detection and localStorage
 * persistence for user theme preferences.
 * 
 * Features:
 * - Automatic system theme detection
 * - Persistent theme storage in localStorage
 * - Smooth theme transitions
 * - Accessibility-compliant theme switching
 * - Support for light, dark, and system preference modes
 */

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: "dark" | "light"
  resolvedTheme: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  systemTheme: "light",
  resolvedTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "mindcare-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("light")
  
  const resolvedTheme = theme === "system" ? systemTheme : theme

  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")

    // Apply the resolved theme
    if (resolvedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.add("light")
    }
  }, [resolvedTheme])

  useEffect(() => {
    // Detect system theme preference
    const detectSystemTheme = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setSystemTheme(isDark ? "dark" : "light")
    }

    // Initial detection
    detectSystemTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => detectSystemTheme()
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    systemTheme,
    resolvedTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}