import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './style.css';
import { supportedChains } from './utils/chains';
import { formatUnits } from 'viem'; 

//updates for using wagmi
import { useAccount, useBalance, useConnect, useDisconnect, useChainId } from 'wagmi';

//Changes for ca-wagmi
import { Account } from "./utils/accounts.tsx";
import { WalletOptions } from "./utils/wallet-options";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

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
  const [activeConnectorName, setActiveConnectorName] = useState<string | null>(null);

  const handleConnect = (connector: any) => {
    console.log('Connecting with:', connector.name);
    setActiveConnectorName(connector.name); // Store the selected connector’s name
    connect({ connector }); // Trigger the connection
  };

  // Debug state changes
  useEffect(() => {
    console.log('isConnected:', isConnected);
    console.log('activeConnectorName:', activeConnectorName);
    console.log('address:', address);
  }, [isConnected, activeConnectorName, address]);

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
      </div>
      <h1>Vite + React </h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React logos to learn more
      </p>

      <div className="app-container">
        <div>
          <a href="https://wagmi.sh" target="_blank">
            <img src="https://raw.githubusercontent.com/wevm/wagmi/refs/heads/main/site/public/logo-light.svg" className="logo" alt="Wagmi logo" />
          </a>   
          </div>
        <h1>Wagmi + Vite + React</h1>       
        {isConnected ? (
          <div>
            <button onClick={() => setIsPopupOpen(true)}>See Balance</button>
            <button className="disconnect-button" onClick={() => disconnect()}>
              Disconnect
            </button>
            <p>
              Connected via: {activeConnectorName ?? 'Unknown'}
            </p>
          </div>
        ) : (
          /*
          <button onClick={() => connect({ connector: connectors[0] })}>
            Connect Wallet
          </button>
          */
          <div>
            {connectors.map((conn) => (          
              <button
                key={conn.id}
                onClick={() => handleConnect(conn)}
                style={{ marginRight: '10px' }}
              >
                Connect with {conn.name}
              </button>
            ))}
          </div>
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
        <p className="read-the-docs">
          Click on the Wagmi logo to learn more
        </p> 
      </div>
      <div className="app-container">
        <h1>Arcana + Wagmi + Vite + React </h1>
        <a href="https://arcana.network" target="_blank">
            <img src="https://avatars.githubusercontent.com/u/82495837" className="logo" alt="Arcana logo" /></a> 
        <div className="card">
          <p>Uses <a href="https://www.npmjs.com/package/@arcana/ca-wagmi">`ca-wagmi`</a> SDK</p>
        </div>
        <ConnectWallet />
        <p className="read-the-docs">
          Click on the Arcana logo to learn more.
        </p> 
      </div>
      <div className="card">
        <a href="docs.arcana.network">Developer Docs</a>  
      </div>
    </>
  )
}

export default App
