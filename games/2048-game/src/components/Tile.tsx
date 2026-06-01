import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { ThemeColors } from '@/types'

interface TileProps {
  value: number
  isNew: boolean
  isMerged: boolean
  theme: ThemeColors
}

function getFontSize(value: number): string {
  if (value < 10) return '2rem'
  if (value < 100) return '1.75rem'
  if (value < 1000) return '1.5rem'
  return '1.25rem'
}

function getTileColor(value: number, theme: ThemeColors): { bg: string; text: string } {
  const bg = theme.tileBg[value] || '#3c3a32'
  const text = theme.tileText[value] || theme.tileTextLight
  return { bg, text }
}

const Tile: React.FC<TileProps> = ({ value, isNew, isMerged, theme }) => {
  const { bg, text } = useMemo(() => getTileColor(value, theme), [value, theme])
  const fontSize = useMemo(() => getFontSize(value), [value])

  const isNewVariant = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  }

  const isMergedVariant = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1] },
    transition: { duration: 0.2 },
  }

  const staticVariant = {
    initial: { scale: 1 },
    animate: { scale: 1 },
  }

  const variant = isNew ? isNewVariant : isMerged ? isMergedVariant : staticVariant

  return (
    <motion.div
      key={`${value}-${isNew}-${isMerged}`}
      className="flex items-center justify-center rounded-md font-bold"
      style={{
        backgroundColor: bg,
        color: text,
        fontSize,
        width: '100%',
        height: '100%',
      }}
      {...variant}
    >
      {value}
    </motion.div>
  )
}

export default Tile
