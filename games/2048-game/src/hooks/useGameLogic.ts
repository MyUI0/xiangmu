import { useEffect, useCallback } from 'react'
import { useGameStore } from '@/store/useGameStore'
import type { Direction } from '@/types'

export function useGameLogic() {
  const move = useGameStore(state => state.move)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      }
      const direction = keyMap[e.key]
      if (direction) {
        e.preventDefault()
        move(direction)
      }
    },
    [move]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { move }
}
