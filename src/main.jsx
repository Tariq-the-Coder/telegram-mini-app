import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/Tariq-the-Coder/demo/refs/heads/main/tonconnect-manifest.json">
        <App />
    </TonConnectUIProvider>
  </StrictMode>
);
