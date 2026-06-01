import React from 'react'
import { useGameLogic } from '@/hooks/useGameLogic'
import GameBoard from '@/components/GameBoard'
import ScoreBoard from '@/components/ScoreBoard'
import ControlPanel from '@/components/ControlPanel'

const Home: React.FC = () => {
  useGameLogic()

  return (
    <div className="flex flex-col gap-4">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-amber-600">2048</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          合并数字，挑战 2048!
        </p>
      </div>

      {/* 分数面板 */}
      <ScoreBoard />

      {/* 游戏网格 */}
      <GameBoard />

      {/* 控制面板 */}
      <ControlPanel />
    </div>
  )
}

export default Home
