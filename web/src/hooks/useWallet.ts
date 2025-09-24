import { useState, useEffect, useCallback } from 'react';
import { Web3Wallet, WalletInfo } from '@/utils/web3';
import { useToast } from '@/hooks/use-toast';

export interface UseWalletReturn {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: string | null;
  network: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  error: string | null;
}

export const useWallet = (): UseWalletReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const wallet = Web3Wallet.getInstance();

  const updateWalletInfo = useCallback(async () => {
    try {
      const connected = await wallet.isConnected();
      setIsConnected(connected);

      if (connected) {
        const address = wallet.getAddress();
        setAddress(address);

        if (address) {
          const [balance, network] = await Promise.all([
            wallet.getBalance(),
            wallet.getNetwork()
          ]);
          setBalance(balance);
          setNetwork(network.name);

          // Check if we're on Arbitrum Sepolia
          if (network.name.toLowerCase() !== 'arbitrum sepolia') {
            try {
              await wallet.switchToArbitrumSepolia();
              // Update network info after switching
              const newNetwork = await wallet.getNetwork();
              setNetwork(newNetwork.name);
            } catch (error: any) {
              setError('Please switch to Arbitrum Sepolia network');
              toast({
                title: "Wrong Network",
                description: "Please switch to Arbitrum Sepolia network",
                variant: "destructive",
              });
            }
          }
        }
      } else {
        setAddress(null);
        setBalance(null);
        setNetwork(null);
      }
    } catch (error: any) {
      console.error('Failed to update wallet info:', error);
      setError(error.message);
    }
  }, [wallet, toast]);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const walletInfo: WalletInfo = await wallet.connectWallet();
      setAddress(walletInfo.address);
      setIsConnected(true);

      // Get additional info
      const [balance, network] = await Promise.all([
        wallet.getBalance(),
        wallet.getNetwork()
      ]);
      setBalance(balance);
      setNetwork(network.name);

      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletInfo.address.slice(0, 6)}...${walletInfo.address.slice(-4)}`,
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [wallet, toast]);

  const disconnectWallet = useCallback(async () => {
    try {
      await wallet.disconnectWallet();
      setIsConnected(false);
      setAddress(null);
      setBalance(null);
      setNetwork(null);
      setError(null);

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      setError(error.message);
    }
  }, [wallet, toast]);

  // Check for existing connection on mount
  useEffect(() => {
    updateWalletInfo();
  }, [updateWalletInfo]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        updateWalletInfo();
      }
    };

    const handleChainChanged = () => {
      updateWalletInfo();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [disconnectWallet, updateWalletInfo]);

  return {
    isConnected,
    isConnecting,
    address,
    balance,
    network,
    connectWallet,
    disconnectWallet,
    error
  };
};
