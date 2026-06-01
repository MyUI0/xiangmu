import { useGameStore } from '@/store/useGameStore'
import type { ThemeColors, ThemeName } from '@/types'

const themes: Record<ThemeName, ThemeColors> = {
  classic: {
    bg: '#bbada0',
    cell: '#cdc1b4',
    tileBg: {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    },
    tileText: { 2: '#776e65', 4: '#776e65' },
    tileTextLight: '#f9f6f2',
  },
  neon: {
    bg: '#0a0a1a',
    cell: '#1a1a3e',
    tileBg: {
      2: '#1e3a5f',
      4: '#16213e',
      8: '#0f3460',
      16: '#533483',
      32: '#e94560',
      64: '#ff6b6b',
      128: '#00d2ff',
      256: '#00ff88',
      512: '#ffdd57',
      1024: '#ff9ff3',
      2048: '#f368e0',
    },
    tileText: {},
    tileTextLight: '#ffffff',
  },
  light: {
    bg: '#e0f2fe',
    cell: '#f0f9ff',
    tileBg: {
      2: '#f0f9ff',
      4: '#e0f2fe',
      8: '#bae6fd',
      16: '#7dd3fc',
      32: '#38bdf8',
      64: '#0ea5e9',
      128: '#0284c7',
      256: '#0369a1',
      512: '#075985',
      1024: '#0c4a6e',
      2048: '#082f49',
    },
    tileText: { 2: '#0c4a6e', 4: '#0c4a6e' },
    tileTextLight: '#f0f9ff',
  },
  rainbow: {
    bg: '#f5f5f4',
    cell: '#e7e5e4',
    tileBg: {
      2: '#fef3c7',
      4: '#d9f99d',
      8: '#a7f3d0',
      16: '#67e8f9',
      32: '#a5b4fc',
      64: '#c4b5fd',
      128: '#f0abfc',
      256: '#fda4af',
      512: '#fb923c',
      1024: '#facc15',
      2048: '#4ade80',
    },
    tileText: { 2: '#92400e', 4: '#365314' },
    tileTextLight: '#ffffff',
  },
}

export function useTheme() {
  const themeName = useGameStore(state => state.theme)
  const setTheme = useGameStore(state => state.setTheme)

  const theme = themes[themeName]

  return { themeName, theme, setTheme, themes }
}
