import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { aplicarTema } from './lib/theme'
import { aplicarReset } from './lib/reset'
import { getMarca, PREFIXO_STORAGE } from './data/repository'

aplicarReset(PREFIXO_STORAGE)
aplicarTema(getMarca())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
