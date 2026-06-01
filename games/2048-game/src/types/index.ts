export type Direction = 'up' | 'down' | 'left' | 'right'

export type ThemeName = 'classic' | 'neon' | 'light' | 'rainbow'

export interface TileData {
  value: number
  row: number
  col: number
  isNew: boolean
  isMerged: boolean
}

export interface ThemeColors {
  bg: string
  cell: string
  tileBg: Record<number, string>
  tileText: Record<number, string>
  tileTextLight: string
}

export interface GameState {
  grid: number[][]
  score: number
  bestScore: number
  gameOver: boolean
  gameWon: boolean
  keepPlaying: boolean
}
