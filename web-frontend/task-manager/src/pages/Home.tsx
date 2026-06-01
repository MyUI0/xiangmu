import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import TaskInput from '@/components/TaskInput'
import TaskFilters from '@/components/TaskFilters'
import TaskCard from '@/components/TaskCard'
import Empty from '@/components/Empty'
import { useTaskStore } from '@/store/useTaskStore'

export default function Home() {
  const tasks = useTaskStore((s) => s.tasks)
  const filter = useTaskStore((s) => s.filter)
  const reorderTasks = useTaskStore((s) => s.reorderTasks)

  const filteredTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => a.order - b.order)
    if (filter === 'active') return sorted.filter((t) => !t.completed)
    if (filter === 'completed') return sorted.filter((t) => t.completed)
    return sorted
  }, [tasks, filter])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 transition-colors dark:bg-slate-900">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Header */}
        <Header />

        {/* Stats */}
        <StatsBar />

        {/* Input */}
        <TaskInput />

        {/* Filters */}
        <TaskFilters />

        {/* Task List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {filteredTasks.length === 0 && <Empty />}
      </div>
    </div>
  )
}
