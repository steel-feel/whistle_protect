import { WalletAdapter } from "@manahippo/aptos-wallet-adapter";

declare global {
  interface Window {
    aptos?: {
      wallets: WalletAdapter[];
    };
  }
}