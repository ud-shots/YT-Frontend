import App from './App.tsx'
import { SuccessProvider } from './src/Common/Toasts/SuccessProvider.tsx'
import { AlertProvider } from './src/Common/Toasts/AlertProvider.tsx'
import { BrowserRouter } from 'react-router'
import { LoaderProvider } from './src/Common/Loader/useLoader.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import './index.css'
import { env } from './src/Common/index.tsx'
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <SuccessProvider>
      <AlertProvider>
        <LoaderProvider>
          <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </LoaderProvider>
      </AlertProvider>
    </SuccessProvider>
  </BrowserRouter>
);