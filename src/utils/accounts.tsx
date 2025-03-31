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
                    <button
                    >
                    Loading wallet...
                    </button>
                </div>
            ) : (
                <div>
                    <p>
                        {address && ensName ? `${ensName} (${address})` : address}
                    </p>
                    <button
                        onClick={() => disconnect()}
                        >
                        Disconnect
                    </button>
                    <button
                        onClick={() => showModal()}
                        >
                        Show balances
                    </button>
                </div>
            )}
      </>
    );
  }//function Account()