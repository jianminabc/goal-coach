import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.css'  // 引入 Tailwind + 全域 CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
