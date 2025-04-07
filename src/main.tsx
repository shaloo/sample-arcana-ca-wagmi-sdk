import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './style.css';
import './App.css';

import App from './App.tsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider, createConfig } from 'wagmi';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from '@wagmi/connectors';
import { supportedChains } from './utils/chains';

//Arcana ca-wagmi SDK integration
import { CAProvider } from '@arcana/ca-wagmi';

// Create transports for each chain dynamically
const transports = supportedChains.reduce((acc, chain) => {
  acc[chain.id] = http();
  return acc;
}, {} as Record<number, ReturnType<typeof http>>);

// Configure Wagmi
const config = createConfig({
  chains: supportedChains, // Define supported chains
  connectors: [injected()], // Connectors for wallet connection
  transports,
  autoConnect: true,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CAProvider>
            <App />
        </CAProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
