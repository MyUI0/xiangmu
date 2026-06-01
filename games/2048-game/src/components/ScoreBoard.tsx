import React from 'react'
import { useGameStore } from '@/store/useGameStore'

const ScoreBoard: React.FC = () => {
  const score = useGameStore(state => state.score)
  const bestScore = useGameStore(state => state.bestScore)

  return (
    <div className="flex gap-3">
      <div className="flex-1 bg-amber-600 rounded-lg p-3 text-center">
        <div className="text-amber-200 text-xs font-semibold uppercase tracking-wider">
          分数
        </div>
        <div className="text-white text-2xl font-bold">{score}</div>
      </div>
      <div className="flex-1 bg-amber-700 rounded-lg p-3 text-center">
        <div className="text-amber-200 text-xs font-semibold uppercase tracking-wider">
          最高分
        </div>
        <div className="text-white text-2xl font-bold">{bestScore}</div>
      </div>
    </div>
  )
}

export default ScoreBoard
