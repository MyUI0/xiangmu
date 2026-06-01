import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Home from '@/pages/Home'
import Detail from '@/pages/Detail'
import Profile from '@/pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
