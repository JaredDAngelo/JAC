import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Bootstrap removed - we use Tailwind + example global CSS

createRoot(document.getElementById('root')).render(
  <StrictMode>


    <App />


  </StrictMode>,
)
