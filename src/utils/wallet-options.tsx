import * as React from "react";
import { Connector, useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  console.log({ connectors });
  return (
    <>
      <h3 className="text-center mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
        Wallets
      </h3>
      <hr className="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      {connectors
        .filter((c) => c.id !== "injected")
        .map((connector) => (
          <WalletOption
            key={connector.uid}
            connector={connector}
            onClick={() => connect({ connector })}
          />
        ))}
    </>
  );
}

function WalletOption({
    connector,
    onClick,
  }: {
    connector: Connector;
    onClick: () => void;
  }) {
    const [ready, setReady] = React.useState(false);
  
    React.useEffect(() => {
      (async () => {
        const provider = await connector.getProvider();
        setReady(!!provider);
      })();
    }, [connector]);
  
    return (
      <>
        <div className="mx-auto flex align-center justify-center mb-4">
          <button
            disabled={!ready}
            type="button"
            onClick={onClick}
            className="cursor-pointer w-48 text-center text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500"
          >
            <img
              src={connector.icon}
              className="w-4 h-4 me-2 -ms-1 text-[#626890]"
              aria-hidden="true"
            />
            {connector.name}
          </button>
        </div>
      </>
    );
  }