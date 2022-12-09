import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import App from './App';
import { wagmiClient } from './lib/ethers';
import { Buffer } from 'buffer';
import 'antd/dist/reset.css';

// @ts-ignore
window.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
);
