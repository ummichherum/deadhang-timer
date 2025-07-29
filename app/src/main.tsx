import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// PWA Service Worker Registration
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 New app version available - refresh to update')
    // Auto-update for better UX in production
    updateSW(true)
  },
  onOfflineReady() {
    console.log('📱 App ready to work offline')
    // Show user that the app is ready to work offline
    if ('serviceWorker' in navigator) {
      console.log('✅ Service Worker registered and app is cached for offline use')
    }
  },
  immediate: true
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
