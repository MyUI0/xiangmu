import React from 'react'
import { RotateCcw, Keyboard, Smartphone } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { useTheme } from '@/hooks/useTheme'
import type { ThemeName } from '@/types'

const themeLabels: Record<ThemeName, string> = {
  classic: '经典',
  neon: '霓虹',
  light: '清新',
  rainbow: '彩虹',
}

const ControlPanel: React.FC = () => {
  const newGame = useGameStore(state => state.newGame)
  const { themeName, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      {/* 主题切换 */}
      <div className="flex gap-2 justify-center flex-wrap">
        {(Object.keys(themeLabels) as ThemeName[]).map((name) => (
          <button
            key={name}
            onClick={() => setTheme(name)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              themeName === name
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {themeLabels[name]}
          </button>
        ))}
      </div>

      {/* 新游戏按钮 */}
      <div className="flex justify-center">
        <button
          onClick={newGame}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-md"
        >
          <RotateCcw size={18} />
          新游戏
        </button>
      </div>

      {/* 操作说明 */}
      <div className="flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Keyboard size={16} />
          <span>使用方向键移动方块</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone size={16} />
          <span>移动端支持滑动手势</span>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
