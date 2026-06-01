import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Weights from './pages/Weights'
import Notes from './pages/Notes'
import Datasets from './pages/Datasets'
import Algorithms from './pages/Algorithms'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/weights" element={<Weights />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/algorithms" element={<Algorithms />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
