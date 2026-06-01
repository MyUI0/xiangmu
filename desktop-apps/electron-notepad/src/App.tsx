import { useTheme } from '@/hooks/useTheme'
import Home from '@/pages/Home'

export default function App() {
  useTheme()

  return <Home />
}
