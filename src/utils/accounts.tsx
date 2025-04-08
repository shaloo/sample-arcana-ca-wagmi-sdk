import {
    useAccount,
    useDisconnect,
    useEnsName,
    // useSendTransaction
  } from "wagmi";

import {

    useBalanceModal,
    useBalance,
    useCAFn,
  } from "@arcana/ca-wagmi";

import '../App.css'

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
    const { bridge, transfer } = useCAFn();


      return (
        <>
            {loading ? (
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
                    <button className="app-button arcana-color"
                        onClick={() => showModal()}
                        >
                        Show balances
                    </button>
                    <button className="app-button arcana-color"
                        onClick={() => handleBridge()}
                        >
                        Bridge
                    </button>  
                    <button className="app-button arcana-color"
                        onClick={() => handleTransfer()}
                        >
                        Transfer
                    </button>                   
                </div>
            )}
      </>
    );
  }//function Account()