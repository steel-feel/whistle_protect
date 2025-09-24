import { AptosWalletAdapterProvider, NetworkName } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const wallets = [new PetraWallet()];

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <AptosWalletAdapterProvider 
      wallets={wallets}
      onError={(error: Error) => {
        console.log('Wallet error:', error);
      }}
      autoConnect={true}
      >
      {children}
    </AptosWalletAdapterProvider>
  );
}