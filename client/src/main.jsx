import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

const onRedirectCallback = (appState) => {
  window.history.replaceState({}, document.title, appState?.returnTo || "/");
};


createRoot(document.getElementById('root')).render(
  <Auth0Provider
  domain="dev-jualdgdxsldqmwm3.us.auth0.com"
  clientId="zCYOqOnq8GfzctlNsk2YNxBZKS7srqEk"
  authorizationParams={{
    redirect_uri: window.location.origin
  }}
  useRefreshTokens={true}
  cacheLocation='localstorage'
  onRedirectCallback={onRedirectCallback}
>

    <BrowserRouter>
      <App />
    </BrowserRouter>
        </Auth0Provider> 

)
