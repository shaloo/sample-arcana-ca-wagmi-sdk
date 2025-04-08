import { ethers } from "ethers"; // For utils like parseUnits and contract encoding
import { useEffect, useState } from "react";

import {
    useAccount,
    useDisconnect,
    useEnsName,
    // useSendTransaction
  } from "wagmi";

import {
    useSendTransaction,
    useBalanceModal,
    useBalance,
    useCAFn,
  } from "@arcana/ca-wagmi";

import '../App.css'

function handleSend() {
    console.log("Send: TBD")

}

function handleWriteContract() {
    console.log("WriteContract: TBD")

}

function handleBridge() {
    console.log("Bridge: TBD")

}
 
function handleTransfer() {
    console.log("Transfer: TBD")
}

export function Account() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const { showModal } = useBalanceModal();
    const { loading } = useBalance({ symbol: "ETH" });
    const { sendTransaction } = useSendTransaction();
    const { bridge, transfer } = useCAFn();
 
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isSendInputModalOpen, setIsSendInputModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission

    // Supported chains with chain IDs
    const supportedChains = [
        { name: "Ethereum", chainId: 1 },
        { name: "Optimism", chainId: 10 },
        { name: "Arbitrum", chainId: 42161 },
        { name: "Polygon", chainId: 137 },
        { name: "Scroll", chainId: 534352 },
        { name: "Linea", chainId: 59144 },
        { name: "Base", chainId: 8453 },
    ];
    
    // Supported assets
    const supportedAssets = ["ETH", "USDC", "USDT"];
      
    // Token contract addresses (mainnet; adjust for testnets if needed)
    const tokenContracts: { [chainId: number]: { [asset: string]: string } } = {
        1: { // Ethereum
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        },
        10: { // Optimism
        USDC: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        },
        42161: { // Arbitrum
        USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        },
        137: { // Polygon
        USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        },
        534352: { // Scroll
        USDC: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
        USDT: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
        },
        59144: { // Linea
        USDC: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
        USDT: "0xA219439258ca9da29E9Cc4cE5596924745e12B93",
        },
        8453: { // Base
        USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
        },
    };

    // ERC20 ABI for token transfers
    const erc20Abi = [
        "function transfer(address to, uint256 amount) public returns (bool)",
    ];

    useEffect(() => {
        if (!loading || !address) {
          setToastMessage("Please connect your wallet");
        }
    }, [loading, address]);

    const formatBalance = (balance?: { formatted: string; symbol: string }) => {
        return balance ? `${balance.formatted} ${balance.symbol}` : "Loading...";
    };
    
    const handleSend = async (to: string, chainId: number, asset: string,   
        amount: string) => {
        if (!loading || !sendTransaction) {
          setToastMessage("Wallet not connected or sendTransaction, address not available");
          return;
        }
        setIsSubmitting(true);
        try {
          const amountWei = ethers.parseUnits(amount, 18);
          console.log("Preparing transaction:", { to, chainId, asset, amountWei: amountWei.toString() });
    
          // Normalize `to` with 0x prefix
          const recipient = to.startsWith("0x") ? to as `0x${string}` : `0x${to}` as `0x${string}`;
    
          // Define transaction arguments
          const txArgs = asset === "ETH"
            ? {
                to: recipient,
                value: amountWei, // bigint
                chainId,
                gas: BigInt(21000), // Use `gas`, not `gasLimit`
                maxFeePerGas: ethers.parseUnits("20", "gwei"), // EIP-1559
                maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"), // EIP-1559
                type: "eip1559" as const,
              }
            : (() => {
                const contractAddress = tokenContracts[chainId]?.[asset];
                if (!contractAddress) {
                  throw new Error(`${asset} not supported on chain ${chainId}`);
                }
                const tokenContract = new ethers.Contract(contractAddress, erc20Abi);
                const data = tokenContract.interface.encodeFunctionData("transfer", [recipient, amountWei]) as `0x${string}`;
                return {
                  to: contractAddress as `0x${string}`,
                  data,
                  chainId,
                  gas: BigInt(60000),
                  maxFeePerGas: ethers.parseUnits("20", "gwei"),
                  maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
                  type: "eip1559" as const,
                };
              })();
    
          console.log("Transaction Args:", txArgs);
          const txHash = await sendTransaction(txArgs);
    
          console.log("Transaction Hash:", txHash);
          setToastMessage(`Successfully sent ${amount} ${asset} to ${to} on chain ${chainId}. Tx Hash: ${txHash}`);
          setIsSendInputModalOpen(false);
        } catch (err: unknown) {
          console.error("Send failed:", err);
          let errorMessage = "Unknown error";
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === "string") {
            errorMessage = err;
          }
          setToastMessage("Send failed: " + errorMessage);
        } finally {
          setIsSubmitting(false);
        }
    };
    
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const toFV = formData.get("to") as string;
        const chainFV = formData.get("chain") as string; // chainId as string
        const assetFV = formData.get("asset") as string;
        const amountFV = formData.get("amount") as string;
    
        if (!toFV || !chainFV || !assetFV || !amountFV) {
        setToastMessage("Please fill all fields");
        return;
        }
    
        const chainId = parseInt(chainFV, 10);
        handleSend(toFV, chainId, assetFV, amountFV);
    };
    
    return (
        <div>
          <div>
            {!loading ? (
              <div>
                <button className="app-button arcana-color" disabled>
                  Loading wallet...
                </button>
              </div>
            ) : (
              <div>
                <p className="address-text">
                  <strong>Address:</strong> {ensName ? `${ensName} (${address})` : address}
                </p>
                <p>Balance: {formatBalance(balance)}</p>
                <button
                  className="app-button arcana-color"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </button>
                <button
                  className="app-button arcana-color"
                  onClick={() => showModal()} // Using useBalanceModal
                >
                  Show balances
                </button>
                <button
                  className="app-button arcana-color"
                  onClick={() => setIsSendInputModalOpen(true)}
                >
                  Send
                </button>
                {toastMessage && (
                  <div className="app-toast">
                    {toastMessage}
                  </div>
                )}
                {isSendInputModalOpen && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <span className="modal-close" onClick={() => setIsSendInputModalOpen(false)}>
                        ×
                      </span>
                      <h3>Send Transaction</h3>
                      <form onSubmit={handleFormSubmit}>
                        <div className="modal-field">
                          <label htmlFor="to">To Address</label>
                          <input
                            type="text"
                            id="to"
                            name="to"
                            placeholder="Enter recipient address"
                            required
                          />
                        </div>
                        <div className="modal-field">
                          <label htmlFor="chain">Chain</label>
                          <select id="chain" name="chain" required>
                            <option value="">Select a chain</option>
                            {supportedChains.map((chain) => (
                              <option key={chain.chainId} value={chain.chainId}>
                                {chain.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="modal-field">
                          <label htmlFor="asset">Asset</label>
                          <select id="asset" name="asset" required>
                            <option value="">Select an asset</option>
                            {supportedAssets.map((asset) => (
                              <option key={asset} value={asset}>
                                {asset}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="modal-field">
                          <label htmlFor="amount">Amount</label>
                          <input
                            type="number"
                            id="amount"
                            name="amount"
                            placeholder="Enter amount"
                            step="0.000001"
                            min="0"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="app-button"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    );
}