import { useEffect } from 'react'
import { useNoteStore } from '@/store/useNoteStore'

export function useTheme() {
  const theme = useNoteStore((s) => s.theme)
  const accentColor = useNoteStore((s) => s.accentColor)

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches)

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches)
      }
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      applyTheme(theme === 'dark')
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor)
  }, [accentColor])
}
