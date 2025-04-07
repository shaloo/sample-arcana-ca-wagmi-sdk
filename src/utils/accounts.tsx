import {
    useAccount,
    useDisconnect,
    useEnsName,
    // useSendTransaction
  } from "wagmi";

import {

    useBalanceModal,
    useBalance,
  } from "@arcana/ca-wagmi";

import '../App.css'

export function Account() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const { showModal } = useBalanceModal();
    const { loading } = useBalance({ symbol: "ETH" });


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
                    <p>
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
                </div>
            )}
      </>
    );
  }//function Account()