import React from 'react'
import { useGameStore } from '@/store/useGameStore'
import { useTheme } from '@/hooks/useTheme'
import { useSwipe } from '@/hooks/useSwipe'
import Empty from './Empty'
import Tile from './Tile'

const GameBoard: React.FC = () => {
  const grid = useGameStore(state => state.grid)
  const newTiles = useGameStore(state => state.newTiles)
  const mergedTiles = useGameStore(state => state.mergedTiles)
  const move = useGameStore(state => state.move)
  const gameOver = useGameStore(state => state.gameOver)
  const gameWon = useGameStore(state => state.gameWon)
  const continueGame = useGameStore(state => state.continueGame)

  const { theme } = useTheme()
  const { onTouchStart, onTouchEnd } = useSwipe(move)

  return (
    <div className="relative">
      <div
        className="grid grid-cols-4 gap-2 p-2 rounded-lg"
        style={{ backgroundColor: theme.bg }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {grid.map((row, r) =>
          row.map((value, c) => {
            const key = `${r},${c}`
            if (value === 0) {
              return <Empty key={key} color={theme.cell} />
            }
            return (
              <Tile
                key={key}
                value={value}
                isNew={newTiles.has(key)}
                isMerged={mergedTiles.has(key)}
                theme={theme}
              />
            )
          })
        )}
      </div>

      {/* 游戏结束遮罩 */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg">
          <p className="text-3xl font-bold text-white mb-4">游戏结束!</p>
          <button
            onClick={() => useGameStore.getState().newGame()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
          >
            再来一局
          </button>
        </div>
      )}

      {/* 胜利遮罩 */}
      {gameWon && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-500/60 rounded-lg">
          <p className="text-3xl font-bold text-white mb-4">你赢了!</p>
          <div className="flex gap-3">
            <button
              onClick={continueGame}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors"
            >
              继续游戏
            </button>
            <button
              onClick={() => useGameStore.getState().newGame()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
            >
              新游戏
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameBoard
