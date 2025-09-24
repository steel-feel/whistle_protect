import { create } from 'zustand'
import { 
  WalletAdapter, 
  NetworkInfo, 
   
} from "@manahippo/aptos-wallet-adapter";

interface WalletState {
  wallet: WalletAdapter | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,
  address: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  connect: async () => {
    try {
      set({ isConnecting: true, error: null });
      
      // Check if Petra wallet is available
      if (!window.aptos) {
        throw new Error('Petra wallet not found. Please install Petra wallet extension.');
      }

      const petraWallet = window.aptos.wallets[0];  // Petra wallet should be the first one
      if (!petraWallet) {
        throw new Error('Petra wallet not found. Please install Petra wallet extension.');
      }

      set({ wallet: petraWallet });
      
      await petraWallet.connect();
      const address = await petraWallet.publicAccount?.address;
      
      if (address) {
        set({
          address: address.toString(),
          isConnected: true,
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
      console.error('Failed to connect wallet:', error);
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: async () => {
    try {
      await get().wallet?.disconnect();
      set({
        address: null,
        isConnected: false,
      });
    } catch (error) {
      set({ error: (error as Error).message });
      console.error('Failed to disconnect wallet:', error);
    }
  },
}));