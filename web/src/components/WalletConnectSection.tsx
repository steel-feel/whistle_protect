import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowLeft, Wallet, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";

interface WalletConnectSectionProps {
  onConnect: () => void;
  connected: boolean;
}

export const WalletConnectSection: React.FC<WalletConnectSectionProps> = ({ onConnect, connected }) => {
  const { 
    isConnected, 
    isConnecting, 
    address, 
    balance, 
    network, 
    connectWallet, 
    error 
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      // Only call onConnect if we successfully connected and switched to Arbitrum Sepolia
      if (isConnected && network?.toLowerCase() === 'arbitrum sepolia') {
        onConnect();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="self-start">
        <Button 
          variant="outline" 
          className="bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-100 hover:text-gray-800 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit to Home
        </Button>
      </Link>
      
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="p-6 rounded-full bg-[#3FB8AF]/10 mb-2 animate-pulse">
          <LogIn className="h-10 w-10 text-[#3FB8AF]" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-200 mb-6 max-w-md text-center text-base leading-relaxed">
          Start your anonymous whistleblow submission. Connect your crypto wallet to begin the secure process. All actions are completely anonymous.
        </p>

        {/* Wallet Info Display */}
        {isConnected && address && (
          <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 w-full max-w-md mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="h-5 w-5 text-[#3FB8AF]" />
              <span className="text-white font-medium">Wallet Connected</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Address:</span>
                <span className="text-white font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              {balance && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-white">{parseFloat(balance).toFixed(4)} ETH</span>
                </div>
              )}
              {network && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white capitalize">{network}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 w-full max-w-md mb-4">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* MetaMask Detection */}
        {!window.ethereum && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 w-full max-w-md mb-4">
            <p className="text-yellow-400 text-sm text-center mb-3">
              MetaMask not detected. Please install MetaMask to continue.
            </p>
            <Button
              variant="outline"
              className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => window.open('https://metamask.io', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Install MetaMask
            </Button>
          </div>
        )}

        <Button
          className={`px-8 py-4 rounded-lg font-semibold shadow-lg bg-[#3FB8AF] text-[#0D1117] hover:bg-[#2FA39E] hover:scale-105 transition-all duration-200 text-lg ${
            isConnected ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={isConnected || isConnecting || !window.ethereum}
          onClick={handleConnect}
        >
          {isConnecting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : isConnected ? (
            "✓ Wallet Connected"
          ) : (
            "Connect Wallet"
          )}
        </Button>
      </div>
    </div>
  );
};
