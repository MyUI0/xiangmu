import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Dashboard from '@/pages/Dashboard'
import Analytics from '@/pages/Analytics'
import Alerts from '@/pages/Alerts'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
