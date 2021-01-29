import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

const ElectronCookies = require('@exponent/electron-cookies')

ElectronCookies.enable({ origin: 'https://desktop.unity.app' })

ReactDOM.render(<App />, document.getElementById('root'))

window.wootric_survey_immediately = true
window.wootricSettings = {
  email: 'customer@example.com',
  created_at: 1234567890,
  account_token: 'NPS-6838b28d'
}
window.onload = () => {
  const script = document.createElement("script")
  script.src = "https://cdn.wootric.com/wootric-sdk.js"
  script.onload = () => {
    window.wootric('run')
  }
  document.body.appendChild(script)
};
