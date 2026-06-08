import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Prompts from './pages/Prompts'
import Notes from './pages/Notes'
import Datasets from './pages/Datasets'
import Scripts from './pages/Scripts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/scripts" element={<Scripts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
