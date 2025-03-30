import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './style.css';

import { useAccount, useBalance, useConnect, useDisconnect, useChainId } from 'wagmi';
import { supportedChains } from './utils/chains';
import { formatUnits } from 'viem'; 

function App() {
  const [count, setCount] = useState(0)

  // Hooks for wallet connection
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId(); // Get the current chain id with useChainId
  
  // Fetch balance for connected address
  const { data: balance } = useBalance({
    address: address,
    chainId: chainId, // Use the wallet's active chain
    enabled: !!address, // Only fetch if address exists
  });

  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Find current chain details from supportedChains
  const currentChain = supportedChains.find(chain => chain.id === chainId) || {
    id: chainId,
    name: 'Unknown Chain',
  };

  // Format balance manually
  const formattedBalance = balance?.value
  ? formatUnits(balance.value, balance.decimals) // Convert wei to human-readable units
  : '0';

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://wagmi.sh" target="_blank">
          <img src="https://raw.githubusercontent.com/wevm/wagmi/refs/heads/main/site/public/logo-light.svg" className="logo" alt="Wagmi logo" />
        </a>   
        <a href="https://arcana.network" target="_blank">
          <img src="https://avatars.githubusercontent.com/u/82495837" className="logo" alt="Arcana logo" />
        </a>      
      </div>
      <h1>Vite + React + Wagmi + Arcana</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React and Wagmi logos to learn more
      </p>

      <div className="app-container">
      <h1>Arcana <a href="https://www.npmjs.com/package/@arcana/ca-wagmi">`ca-wagmi`</a> SDK Integration Sample</h1>
      {isConnected ? (
        <div>
          <button onClick={() => setIsPopupOpen(true)}>See Balance</button>
          <button className="disconnect-button" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={() => connect({ connector: connectors[0] })}>
          Connect Wallet
        </button>
      )}
      {/* Popup/Modal */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={() => setIsPopupOpen(false)}>
              X
            </button>
            <h2>Wallet Details</h2>
            <p className="popup-address">Connected Address: {address}</p>
            <p>
            Balance: {formattedBalance} {balance?.symbol}
            </p>
            <p>Chain: {currentChain.name} (ID: {currentChain.id})</p>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default App
