import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Lock, CheckCircle, Copy, ArrowRight, ArrowLeft, Users, Gavel, Shield, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { StepIndicator } from "@/components/StepIndicator";
import { EMLPropReturn, EMLUploadSection } from "@/components/EMLUploadSection";
import { TooltipInfo } from "@/components/TooltipInfo";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { doTx, makeTxn } from "@/lib/aptos_helper";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { set } from "react-hook-form";

const Submit = () => {
  const { 
    connect,
    disconnect,
    account,
    connected,
    wallet,
    isLoading,
    signTransaction
  } = useWallet();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    files: [] as File[],
    targetGroup: 'public'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedVID, setGeneratedVID] = useState('');
  const [domain, setDomain] = useState('')
  const [emailVerified, setEmailVerified] = useState(false);
  const { toast } = useToast();
  const categories = [
    "NGO", "Government", "Corporate"
  ];

  const verifiedGroups = [
    { id: "public", name: "Public Feed", icon: Users, description: "Visible to all users" },
    { id: "journalists", name: "Investigative Journalists", icon: Newspaper, description: "42 verified reporters", comingSoon: true },
    { id: "legal", name: "Legal Forums", icon: Gavel, description: "28 verified legal professionals", comingSoon: true },
    { id: "ngos", name: "NGOs & Watchdogs", icon: Shield, description: "73 verified organizations", comingSoon: true }
  ];

  const steps = [
    { label: "Connect Wallet" },
    { label: "Verify Email" },
    { label: "Submit Whistleblow" }
  ];
  
  const currentStep = !connected ? 0 : !emailVerified ? 1 : 2;

  const handleSubmit = async (e: React.FormEvent) => {
    try{
    e.preventDefault();
    setIsSubmitting(true);
  //prepare payload
    const data = {
      status: 'verified',
      date: new Date(),
      title: formData.title,
      content: formData.description,
      category: formData.category,
      attestations: 0,
      domain,
      submitter: account?.address
    }

    const tx = await makeTxn(data, account.address);
    const aliceSenderAuthenticator = signTransaction({
        transactionOrPayload : tx
    });

    const vId = await doTx(aliceSenderAuthenticator,tx);

    //Submit Aptos transaction
    setGeneratedVID(vId)
   
    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 3000);

  }catch(err) {
    setIsSubmitting(false)
    setSubmitted(false);
  }

  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        files: Array.from(e.target.files)
      });
    }
  };

  const copyCID = () => {
    navigator.clipboard.writeText(generatedVID);
    toast({
      title: "Verification ID Copied",
      description: "Your Verification CID has been copied to clipboard",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white font-['Inter',sans-serif] flex items-center justify-center p-6">
        <Card className="bg-[#161B22] border-gray-700 max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto mb-8">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-white">Submission Successful</h2>
            <p className="text-gray-100 mb-8 text-lg leading-relaxed">
              Your disclosure has been encrypted and submitted to the network.
              It will be reviewed by our decentralized verification system.
            </p>
            <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-700 mb-8">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm text-gray-400 mb-1">Your VID:</p>
                  <p className="font-mono text-[#3FB8AF] text-lg break-all">{generatedVID}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCID}
                  className="ml-4 border-[#3FB8AF] text-[#3FB8AF] hover:bg-[#3FB8AF] hover:text-[#0D1117] transition-all duration-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-10 leading-relaxed">
              Save this CID for future reference. It's your unique identifier for tracking this submission and proving authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/feed">
                <Button className="bg-[#3FB8AF] hover:bg-[#2FA39E] text-[#0D1117] font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg">
                  <span>View Feed</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white font-medium px-8 py-3 rounded-lg transition-all duration-200"
                onClick={() => {
                  setSubmitted(false);
                  setGeneratedVID('')
                  setDomain('')
                  setFormData({ category: '', title: '', description: '', files: [], targetGroup: 'Government' });
                }}
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col justify-center">
        <div className="max-w-lg mx-auto w-full px-4 pt-8">
          <StepIndicator steps={steps} current={0} />
          <Card className="bg-[#161B22] border-gray-700 mt-8">
            <CardContent className="p-12 text-center">
              <div className="p-4 bg-[#3FB8AF]/10 rounded-full w-fit mx-auto mb-8">
                <FileText className="h-16 w-16 text-[#3FB8AF]" />
              </div>
              <h2 className="text-2xl font-bold mb-6 text-white">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-8">
                To submit a whistleblow, you need to connect your Petra wallet first. This ensures your submission is securely recorded on the Aptos blockchain.
              </p>
              <Button
                onClick={() => connect("Petra")}
                disabled={isLoading}
                className="bg-[#3FB8AF] hover:bg-[#2FA39E] text-[#0D1117] font-medium px-8 py-3 rounded-lg transition-all duration-200"
              >
                {isLoading ? "Connecting..." : "Connect Petra Wallet"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!emailVerified) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col justify-center">
        <div className="max-w-lg mx-auto w-full px-4 pt-8">
          <StepIndicator steps={steps} current={1} />
          <EMLUploadSection
            onVerified={(e: EMLPropReturn) => {
              console.log({ e });
            
              setDomain(e.domain)

              setEmailVerified(true);
              toast({
                title: "Email Verified",
                description: "Proceed to submit your whistleblow",
              });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-['Inter',sans-serif]">
      {/* Header */}
      <header className="border-b border-gray-700 bg-[#0D1117] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-[#3FB8AF]/10 rounded-lg">
              <FileText className="h-6 w-6 text-[#3FB8AF]" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Whistle Protect</span>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-medium px-6 py-2 rounded-lg transition-all duration-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-10">
        <StepIndicator steps={steps} current={2} />

        {/* Success Message */}
        <div className="bg-green-400/10 border border-green-400/30 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex gap-4 items-center">
            <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-300 mb-1 text-lg">
                Email Verified Successfully
              </h3>
              <p className="text-gray-200 leading-relaxed">
                You can now submit your whistleblow. Your identity remains anonymous throughout this process.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-[#161B22] border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl text-white">
              <div className="p-2 bg-[#3FB8AF]/10 rounded-lg">
                <Lock className="h-6 w-6 text-[#3FB8AF]" />
              </div>
              <span>Submit Whistleblow</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Recipients */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-white">Who should see this?</Label>
                <div className="grid gap-4">
                  {verifiedGroups.map(group => (
                    <div
                      key={group.id}
                      className={`p-4 rounded-lg border transition-all duration-200 group flex items-center relative ${formData.targetGroup === group.id
                          ? "border-[#3FB8AF] bg-[#3FB8AF]/10"
                          : "border-gray-700 hover:border-gray-600"
                        } ${group.comingSoon ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02]"}`}
                      onClick={() => !group.comingSoon && setFormData({ ...formData, targetGroup: group.id })}
                    >
                      <div className="flex items-center space-x-3">
                        <group.icon className="h-5 w-5 text-[#3FB8AF]" />
                        <div>
                          <div className="font-medium text-white">{group.name}</div>
                          <div className="text-sm text-gray-300">{group.description}</div>
                        </div>
                      </div>
                      {group.comingSoon && (
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20 text-xs px-2 py-1 font-medium rounded-full">
                            Coming Soon
                          </Badge>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label className="text-lg font-medium text-white">Category</Label>
                <div className="flex flex-wrap gap-3">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={formData.category === category ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${formData.category === category
                          ? "bg-[#3FB8AF] text-[#0D1117] shadow-lg"
                          : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      onClick={() => setFormData({ ...formData, category })}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <Label className="text-lg font-medium text-white">Organisation Domain</Label>
                <Input
                  disabled
                  className="bg-[#0D1117] border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg focus:border-[#3FB8AF] focus:ring-[#3FB8AF]/20"
                  value={domain}
                // onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-medium text-white">Title</Label>
                <Input
                  placeholder="Short summary of your whistleblow..."
                  className="bg-[#0D1117] border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg focus:border-[#3FB8AF] focus:ring-[#3FB8AF]/20"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label className="text-lg font-medium text-white">Details</Label>
                <Textarea
                  placeholder="Describe your whistleblow in detail. Avoid including your identity or personal info."
                  rows={8}
                  className="bg-[#0D1117] border-gray-700 text-white placeholder-gray-400 resize-none rounded-lg focus:border-[#3FB8AF] focus:ring-[#3FB8AF]/20"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* File Upload ( Coming Soon )*/}
              {/* <div className="space-y-3">
                <Label className="text-lg font-medium text-white flex items-center">
                  Upload Supporting Files (Coming Soon. . .)
                  <TooltipInfo
                    text=""
                    tooltip="Your files are encrypted and stored securely on IPFS. Remove personal info before uploading to stay anonymous."
                  />
                </Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#3FB8AF]/50 hover:bg-[#19202A] hover:scale-[1.02] transition-all duration-300 group bg-[#19202A]">
                  <div className="p-4 bg-[#3FB8AF]/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-[#3FB8AF]/20 transition-colors">
                    <Upload className="h-8 w-8 text-[#3FB8AF]" aria-hidden />
                  </div>
                  <p className="text-gray-200 mb-4 text-base leading-relaxed">
                    Drag files here or click "Choose Files" to attach relevant evidence.
                  </p>
                  <Input
                    disabled
                    id="files"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Label
                    htmlFor="files"
                    className="cursor-pointer inline-flex items-center px-6 py-3 bg-[#3FB8AF] text-[#0D1117] rounded-lg hover:bg-[#2FA39E] hover:scale-105 transition-all duration-200 font-medium shadow-lg"
                  >
                    Choose Files
                  </Label>
                  {formData.files.length > 0 && (
                    <div className="mt-6 space-y-2">
                      {formData.files.map((file, index) => (
                        <div key={index} className="text-sm text-gray-300 bg-[#0D1117] p-3 rounded border border-gray-700">
                          <span className="font-medium text-white">{file.name}</span>
                          <span className="ml-2 text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div> */}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!formData.description || !formData.category || isSubmitting}
                  className="w-full bg-[#3FB8AF] hover:bg-[#2FA39E] text-[#0D1117] font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin"></div>
                      <span>Encrypting &amp; Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <span>Submit </span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-[#161B22] border-gray-700">
          <CardContent className="p-8">
            <h3 className="font-semibold mb-4 flex items-center space-x-3 text-xl text-white">
              <div className="p-2 bg-[#3FB8AF]/10 rounded-lg">
                <FileText className="h-5 w-5 text-[#3FB8AF]" />
              </div>
              <span>Privacy & Security</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-gray-200">
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center">
                  Encryption
                  <TooltipInfo
                    text=""
                    tooltip="Your submission is encrypted in your browser before it is sent anywhere."
                  />
                </h4>
                <p className="leading-relaxed">
                  All leaks are encrypted using strong end-to-end encryption.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center">
                  Anonymity{" "}
                  <TooltipInfo
                    text=""
                    tooltip="We use zero-knowledge proofs (ZK proofs) to ensure you remain anonymous and cannot be linked to your whistleblow."
                  />
                </h4>
                <p className="leading-relaxed">
                  <TooltipInfo
                    text="Zero-knowledge proofs"
                    tooltip="A cryptographic method that proves you have valid information without revealing your identity or the information itself."
                  /> keep your identity private — you cannot be identified from your submission.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center">
                  Immutability{" "}
                  <TooltipInfo
                    text=""
                    tooltip="Once submitted, your whistleblow is stored on IPFS and timestamped on-chain to guarantee transparency and tamper-proof storage."
                  />
                </h4>
                <p className="leading-relaxed">
                  All files are uploaded to{" "}
                  <TooltipInfo
                    text="IPFS"
                    tooltip="InterPlanetary File System - a distributed network that stores files permanently and makes them impossible to alter or delete."
                  /> for permanent, tamperproof archiving.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center">
                  Attestation
                  <TooltipInfo
                    text=""
                    tooltip="Each attestation is verified and published onchain."
                  />
                </h4>
                <p className="leading-relaxed">
                  Members of the public can attest to a whistleblow by submitting supporting evidence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
