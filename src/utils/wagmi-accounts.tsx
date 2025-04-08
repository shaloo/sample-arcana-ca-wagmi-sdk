import { useEffect, useState } from "react";
import { parseEther, erc20Abi } from 'viem';
import {
    useAccount,
    useBalance,
    useDisconnect,
    useEnsName,
    useSwitchChain,
    useWriteContract,
    useSendTransaction,
  } from "wagmi";
import { supportedChainsId, supportedAssets, listTokenContracts } from './chains';


import '../App.css'

export function WagmiAccount() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const {  isLoading  } = useBalance({ address });
    const { switchChainAsync } = useSwitchChain();
    const { sendTransaction } = useSendTransaction();
    const { writeContract } = useWriteContract();
 
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isSendInputModalOpen, setIsSendInputModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission

    useEffect(() => {
        if (!address) {
          setToastMessage("Please connect your wallet");
        }
    }, [address]);

    const handleSend = async (to: string, chainId: number, asset: string,  amount: string) => {
        if (isLoading || !sendTransaction) {
          setToastMessage("Wallet not connected or sendTransaction, address not available");
          return;
        }
        setIsSubmitting(true);
        try {
          const amountWei = parseEther(amount, 'wei');
          console.log("Preparing transaction:", { to, chainId, asset, amountWei: amountWei.toString() });
    
          // Normalize `to` with 0x prefix
          const recipient = to.startsWith("0x") ? to as `0x${string}` : `0x${to}` as `0x${string}`;

          // Switch to chain
          await switchChainAsync({ chainId: chainId });
              
          if (asset === "ETH"){
            sendTransaction(
              {
                to: recipient,
                value: amountWei,
              },
              {
                onSuccess(hash) {
                  setIsSubmitting(false);
                  console.log("success: transaction hash:", hash);
                  setToastMessage(`Successfully sent ${amount} ${asset} to ${to} on chain ${chainId}. Tx Hash: ${hash}`);
                },
                onSettled() {
                  console.log("settled");
                },
                onError(error) {
                  console.log({ error });
                  setIsSubmitting(false);
                },
              }
            );
          } else {
            if (!supportedAssets.includes(asset.toUpperCase() as "ETH" | "USDC" | "USDT")) {
              console.log(`Asset "${asset}" is not supported. Supported assets: ${supportedAssets.join(", ")}`);
              throw new Error("asset not supported");
            }
            writeContract(
              {
                address: listTokenContracts[chainId]?.[asset] as `0x${string}`,
                abi: erc20Abi,
                functionName: "transfer",
                args: [recipient, amountWei],
              },
              {
                onSuccess(hash) {
                  setIsSubmitting(false);
                  console.log("success: transaction hash:", hash);
                  setToastMessage(`Successfully sent ${amount} ${asset} to ${to} on chain ${chainId}. Tx Hash: ${hash}`);
                },
                onError(error) {
                  setIsSubmitting(false);
                  console.log({ error });
                  setToastMessage(`Error in send WriteContract for ${amount} ${asset} to ${to} on chain ${chainId}: ${error}`);                  
                },
              }
            );            
          }    
          setIsSendInputModalOpen(false);
        } catch (err: unknown) {
          console.error("Send failed:", err);
          let errorMessage = "Unknown error";
          if (err instanceof Error) errorMessage = err.message;
          else if (typeof err === "string") errorMessage = err;
          setToastMessage("Send failed: " + errorMessage);
        } finally {
          setIsSubmitting(false);
        }
    };

    const handleSendInput = (event: React.FormEvent<HTMLFormElement>) => {
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
        <>
            {isLoading ? (
                <div>
                    <button className="app-button arcana-color"
                    >
                    Loading wallet...
                    </button>
                </div>
            ) : (
                <div>
                    <p className="address-text">
                        <strong>Address:</strong>{address && ensName ? `${ensName} (${address})` : address}
                    </p>
                    <button className="app-button arcana-color"
                        onClick={() => disconnect()}
                        >
                        Disconnect
                    </button>
                    {!sendTransaction ? (
                        <p>sendTransaction Function not found</p>
                    ):(
                    <div>
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
                              <form onSubmit={handleSendInput}>
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
                                    {supportedChainsId.map((chain) => (
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
            )}
      </>
    );
  }//function Account()