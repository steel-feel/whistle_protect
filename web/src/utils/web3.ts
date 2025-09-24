import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}

export class Web3Wallet {
  private static instance: Web3Wallet;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private address: string | null = null;

  static getInstance(): Web3Wallet {
    if (!Web3Wallet.instance) {
      Web3Wallet.instance = new Web3Wallet();
    }
    return Web3Wallet.instance;
  }

  async connectWallet(): Promise<WalletInfo> {
    if (!window.ethereum) {
      throw new Error('MetaMask or compatible wallet not found. Please install MetaMask.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.address = await this.signer.getAddress();

      // Switch to Arbitrum Sepolia
      await this.switchToArbitrumSepolia();

      console.log('Wallet connected:', this.address);

      return {
        address: this.address,
        provider: this.provider,
        signer: this.signer
      };
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  async switchToArbitrumSepolia(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask or compatible wallet not found');
    }

    const chainId = '0x66eee'; // Arbitrum Sepolia chain ID in hex
    const rpcUrl = 'https://arbitrum-sepolia.drpc.org';

    try {
      // Try to switch to Arbitrum Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName: 'Arbitrum Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Arbitrum Sepolia network to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to Arbitrum Sepolia network');
      }
    }
  }

  async disconnectWallet(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.address = null;
    console.log('Wallet disconnected');
  }

  async isConnected(): Promise<boolean> {
    if (!window.ethereum || !this.provider) {
      return false;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    } catch {
      return false;
    }
  }

  getAddress(): string | null {
    return this.address;
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  async getBalance(): Promise<string> {
    if (!this.provider || !this.address) {
      throw new Error('Wallet not connected');
    }

    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  async getNetwork(): Promise<ethers.Network> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    return await this.provider.getNetwork();
  }
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
      removeListener: (event: string, callback: (data: any) => void) => void;
      isMetaMask?: boolean;
    };
  }
}
