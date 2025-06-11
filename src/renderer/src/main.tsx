import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import './index.scss'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={window.isElectronApp ? '/' : '/'}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
