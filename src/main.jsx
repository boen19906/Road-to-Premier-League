import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './FootballTycoon.jsx'
import FootballTycoon from './FootballTycoon.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FootballTycoon />
  </StrictMode>,
)
