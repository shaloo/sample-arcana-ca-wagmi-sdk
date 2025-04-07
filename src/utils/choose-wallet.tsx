import * as React from "react";
import { Connector, useConnect } from "wagmi";
import '../App.css'

export function ShowWalletOptions() {
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
          <ListWalletOption
            key={connector.uid}
            connector={connector}
            onClick={() => connect({ connector })}
          />
        ))}
    </>
  );
}

function ListWalletOption({
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
            className="app-button arcana-color"
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