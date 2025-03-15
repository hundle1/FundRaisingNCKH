import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { ToastContainer } from "react-toastify";
import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider desiredChainId={ChainId.Sepolia} 
  clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
  >
    <Router>
      <StateContextProvider>
        <ToastContainer />
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)