import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.tsx'
import Body from './Body.tsx'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header></Header>
    <Body></Body>
    <Footer></Footer>
  </StrictMode>,
)
