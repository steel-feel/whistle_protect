
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhistleblowerTimeline } from "@/components/WhistleblowerTimeline";
import { PrivateSubmissionOptions } from "@/components/PrivateSubmissionOptions";
import { FileText, Lock, Eye, ArrowRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";

const Index = () => {
  const { isConnected, isConnecting, address, connectWallet } = useWallet();

  return (
  <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif]">
      {/* Header */}
  <header className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Whistle Protect</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link 
              to="/feed" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              Feed
            </Link>
            {/* {isConnected && address ? (
              <div className="flex items-center gap-2 bg-[#3FB8AF]/10 px-4 py-2 rounded-lg border border-[#3FB8AF]/30">
                <Wallet className="h-4 w-4 text-[#3FB8AF]" />
                <span className="text-[#3FB8AF] font-medium text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="border-[#3FB8AF] text-[#3FB8AF] hover:bg-[#3FB8AF] hover:text-[#0D1117] transition-all duration-200 font-medium px-6 py-2 rounded-lg"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#3FB8AF] border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            )} */}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
  <section className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
         Truly Secure and Anonymous {" "}
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Whistleblowing
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
A secure platform for verifiable disclosure. There are no gas. No surveillance. Just proof.        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/80 text-background font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            asChild
          >
            <Link to="/submit" className="flex items-center space-x-2">
              <span>Submit an Entry</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-secondary border-border text-foreground hover:bg-muted hover:text-foreground hover:border-muted px-8 py-4 text-lg rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:shadow-sm"
            asChild
          >
            <Link to="/manifesto">Learn More</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Zero-Knowledge Proofs</h3>
              <p className="text-muted-foreground leading-relaxed">Verify authenticity without revealing identity</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Immutable Records</h3>
              <p className="text-muted-foreground leading-relaxed">Blockchain-backed proof of disclosure timestamps</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Anonymous by Design</h3>
              <p className="text-muted-foreground leading-relaxed">No accounts, no tracking, no surveillance</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-6 py-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">History of Whistleblows</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn from the past. Each disclosure changed the world.
          </p>
        </div>
        <WhistleblowerTimeline />
      </section>

      {/* Private Submission Options */}
      <section className="container mx-auto px-6 py-10">
        <PrivateSubmissionOptions />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="font-medium">&copy; 2024 Whistle Protect. Built for transparency, powered by cryptography.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
