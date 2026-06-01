import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
