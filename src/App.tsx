import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import DexPage from './pages/DexPage'
import GamePage from './pages/GamePage'
import SpeciesPage from './pages/SpeciesPage'
import CollectionPage from './pages/CollectionPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dex" element={<DexPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/species/:speciesId" element={<SpeciesPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}