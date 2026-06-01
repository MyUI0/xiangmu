import React from 'react'

interface EmptyProps {
  color: string
}

const Empty: React.FC<EmptyProps> = ({ color }) => {
  return (
    <div
      className="rounded-md"
      style={{ backgroundColor: color }}
    />
  )
}

export default Empty
