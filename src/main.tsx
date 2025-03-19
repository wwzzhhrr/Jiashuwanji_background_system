import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ArtifactProvider } from './context/ArtifactContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtifactProvider>
      <App />
    </ArtifactProvider>
  </StrictMode>,
)
