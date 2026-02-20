import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { seedDatabase } from './utils/seed-loader'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

seedDatabase().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  )
}).catch((error) => {
  console.error('Failed to initialise database:', error)
})