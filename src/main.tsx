import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import App from './App'
import './App.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <HashRouter>
        <App />
      </HashRouter>
    </FluentProvider>
  </React.StrictMode>,
)

export { updateSW }