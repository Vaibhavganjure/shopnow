import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css"
import { Provider } from "react-redux"
import { store } from "./store/store.js"
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe("pk_test_51SfOx5KmoVQitI6Uruw11tZ8pIAYjBolvwixCqL3DKxwzZ8MXSqkpadE0clO75pDwFcz8q5dYftTjdzBw2ESRNyw00uSqOkfoj")

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Provider>
  </StrictMode>,
)
