import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Direction, ThemeName } from '@/types'

interface GameStore {
  grid: number[][]
  score: number
  bestScore: number
  gameOver: boolean
  gameWon: boolean
  keepPlaying: boolean
  newTiles: Set<string>
  mergedTiles: Set<string>
  theme: ThemeName
  move: (direction: Direction) => void
  newGame: () => void
  setTheme: (theme: ThemeName) => void
  continueGame: () => void
}

function createEmptyGrid(): number[][] {
  return Array.from({ length: 4 }, () => Array(4).fill(0))
}

function cloneGrid(grid: number[][]): number[][] {
  return grid.map(row => [...row])
}

function getEmptyCells(grid: number[][]): [number, number][] {
  const cells: [number, number][] = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) cells.push([r, c])
    }
  }
  return cells
}

function addRandomTile(grid: number[][]): { grid: number[][]; pos: [number, number] | null } {
  const empty = getEmptyCells(grid)
  if (empty.length === 0) return { grid, pos: null }
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const newGrid = cloneGrid(grid)
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4
  return { grid: newGrid, pos: [r, c] }
}

function slideRowLeft(row: number[]): { newRow: number[]; score: number; mergedCols: number[] } {
  let filtered = row.filter(v => v !== 0)
  let score = 0
  const mergedCols: number[] = []

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2
      score += filtered[i]
      filtered[i + 1] = 0
      mergedCols.push(i)
      i++
    }
  }

  filtered = filtered.filter(v => v !== 0)
  while (filtered.length < 4) filtered.push(0)

  return { newRow: filtered, score, mergedCols }
}

function transpose(grid: number[][]): number[][] {
  return grid[0].map((_, c) => grid.map(row => row[c]))
}

function reverseRows(grid: number[][]): number[][] {
  return grid.map(row => [...row].reverse())
}

interface MoveResult {
  newGrid: number[][]
  score: number
  mergedCells: Set<string>
}

function moveGridLeft(grid: number[][]): MoveResult {
  let totalScore = 0
  const mergedCells = new Set<string>()
  const newGrid = grid.map((row, r) => {
    const { newRow, score, mergedCols } = slideRowLeft(row)
    totalScore += score
    mergedCols.forEach(c => mergedCells.add(`${r},${c}`))
    return newRow
  })
  return { newGrid, score: totalScore, mergedCells }
}

function moveGridRight(grid: number[][]): MoveResult {
  const reversed = reverseRows(grid)
  const result = moveGridLeft(reversed)
  result.newGrid = reverseRows(result.newGrid)
  const newMerged = new Set<string>()
  result.mergedCells.forEach(key => {
    const [r, c] = key.split(',').map(Number)
    newMerged.add(`${r},${3 - c}`)
  })
  result.mergedCells = newMerged
  return result
}

function moveGridUp(grid: number[][]): MoveResult {
  const transposed = transpose(grid)
  const result = moveGridLeft(transposed)
  result.newGrid = transpose(result.newGrid)
  const newMerged = new Set<string>()
  result.mergedCells.forEach(key => {
    const [r, c] = key.split(',').map(Number)
    newMerged.add(`${c},${r}`)
  })
  result.mergedCells = newMerged
  return result
}

function moveGridDown(grid: number[][]): MoveResult {
  const transposed = transpose(grid)
  const result = moveGridRight(transposed)
  result.newGrid = transpose(result.newGrid)
  const newMerged = new Set<string>()
  result.mergedCells.forEach(key => {
    const [r, c] = key.split(',').map(Number)
    newMerged.add(`${c},${r}`)
  })
  result.mergedCells = newMerged
  return result
}

function moveGrid(grid: number[][], direction: Direction): MoveResult {
  switch (direction) {
    case 'left': return moveGridLeft(grid)
    case 'right': return moveGridRight(grid)
    case 'up': return moveGridUp(grid)
    case 'down': return moveGridDown(grid)
  }
}

function gridsEqual(a: number[][], b: number[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (a[r][c] !== b[r][c]) return false
    }
  }
  return true
}

function canMove(grid: number[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true
    }
  }
  return false
}

function hasWon(grid: number[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 2048) return true
    }
  }
  return false
}

function initGame(): { grid: number[][]; newTiles: Set<string> } {
  let grid = createEmptyGrid()
  const newTiles = new Set<string>()

  const r1 = addRandomTile(grid)
  grid = r1.grid
  if (r1.pos) newTiles.add(`${r1.pos[0]},${r1.pos[1]}`)

  const r2 = addRandomTile(grid)
  grid = r2.grid
  if (r2.pos) newTiles.add(`${r2.pos[0]},${r2.pos[1]}`)

  return { grid, newTiles }
}

function loadBestScore(): number {
  try {
    const saved = localStorage.getItem('2048-best-score')
    return saved ? parseInt(saved, 10) : 0
  } catch {
    return 0
  }
}

function saveBestScore(score: number) {
  try {
    localStorage.setItem('2048-best-score', String(score))
  } catch {
    // ignore
  }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      const { grid: initGrid, newTiles: initNewTiles } = initGame()

      return {
        grid: initGrid,
        score: 0,
        bestScore: loadBestScore(),
        gameOver: false,
        gameWon: false,
        keepPlaying: false,
        newTiles: initNewTiles,
        mergedTiles: new Set<string>(),
        theme: 'classic',

        move: (direction: Direction) => {
          const state = get()
          if (state.gameOver || (state.gameWon && !state.keepPlaying)) return

          const { newGrid, score: moveScore, mergedCells } = moveGrid(state.grid, direction)

          if (gridsEqual(state.grid, newGrid)) return

          const { grid: finalGrid, pos } = addRandomTile(newGrid)

          const newScore = state.score + moveScore
          const bestScore = Math.max(state.bestScore, newScore)
          saveBestScore(bestScore)

          const newNewTiles = new Set<string>()
          if (pos) newNewTiles.add(`${pos[0]},${pos[1]}`)

          const won = !state.keepPlaying && hasWon(finalGrid)
          const lost = !won && !canMove(finalGrid)

          set({
            grid: finalGrid,
            score: newScore,
            bestScore,
            gameOver: lost,
            gameWon: won,
            newTiles: newNewTiles,
            mergedTiles: mergedCells,
          })
        },

        newGame: () => {
          const { grid, newTiles } = initGame()
          set({
            grid,
            score: 0,
            gameOver: false,
            gameWon: false,
            keepPlaying: false,
            newTiles,
            mergedTiles: new Set<string>(),
          })
        },

        setTheme: (theme: ThemeName) => {
          set({ theme })
        },

        continueGame: () => {
          set({ keepPlaying: true, gameWon: false })
        },
      }
    },
    {
      name: '2048-game-storage',
      partialize: (state) => ({
        grid: state.grid,
        score: state.score,
        bestScore: state.bestScore,
        gameOver: state.gameOver,
        gameWon: state.gameWon,
        keepPlaying: state.keepPlaying,
        theme: state.theme,
      }),
    }
  )
)
