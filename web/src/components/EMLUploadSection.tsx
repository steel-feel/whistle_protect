import React, { useRef, useState } from "react";
import { Upload, ArrowLeft, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TooltipInfo } from "./TooltipInfo";
import { isValidEml } from "@/lib/emailUtils";
import { generateInputs, ZKEmailProver } from "@/lib/noir_helper/prover";
import { fromByteArray } from "base64-js";


const pl = new ZKEmailProver("honk", 1);

export type EMLPropReturn = {
  vId: string,
  domain : string
}

interface EMLUploadSectionProps {
  onVerified: (e:EMLPropReturn) => void;
}

export const EMLUploadSection: React.FC<EMLUploadSectionProps> = ({ onVerified }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError("");
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    validateAndVerifyFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files && e.target.files[0];
    validateAndVerifyFile(file);
  };

  async function verifyNow(proof: any): Promise<string> {
    let id: string;
    try {
      //Run verifier logic
      const proofBase64 = await fromByteArray(proof.proof);
    
      //@ts-ignore
    } catch (e) {
      console.error(e);
      throw new Error("Verification failed.");
    }

    return id
  }

  const validateAndVerifyFile = async (file?: File | null) => {
    if (!file || !file.name.toLowerCase().endsWith(".eml")) {
      setError("Please upload a valid .eml file.");
      return;
    }
    setFileName(file.name);
    setVerifying(true);
    setError("");

    try {
      // proof generation
      const email = await file.text();
      const domain = isValidEml(email);
      const input = await generateInputs(email);

      console.time("proof");
      /*
      * Generate proof
      */
      const proof = await pl.fullProve(input);
      console.timeEnd("proof");

      /*
      * Send proof for verification
      */
      let vId = await verifyNow(proof)
      // const vId =  "b0effa25-2ab2-49f2-946b-47b053ebeb55"
      setVerifying(false);
      setVerified(true);
      // Call onVerified immediately after verification
      onVerified({domain,vId})
    } catch (err) {
      console.error(err);
      setError("Failed to verify email. Please try again.");
      setVerifying(false);
    }
  };

  return (
  <div className="min-h-screen bg-background flex flex-col overflow-visible">
      {/* Top Navigation Bar */}
  <div className="w-full px-6 py-4 border-b border-border bg-card">
        <Link to="/" className="inline-block">
          <Button
            variant="outline"
            className="bg-secondary text-foreground border-border hover:bg-muted hover:text-foreground font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit to Home
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center overflow-visible">
  <div className="max-w-lg mx-auto w-full px-4 overflow-visible">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-3">Verify Your Email</h2>
            <div className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto overflow-visible">
              To verify your identity, upload the original{" "}
              <TooltipInfo
                text=".eml file"
                tooltip="An .eml file is the raw email format that contains the original message headers and content. You can usually get this by right-clicking an email and selecting 'Save as' or 'Download.'"
              />{" "}
              from your organization. We do not store your email or any contents within. This verifies the leak while keeping you anonymous.
            </div>
          </div>

          <div
            className={`bg-card border-2 border-dashed rounded-xl p-8 flex flex-col items-center
              transition-all duration-300 cursor-pointer group
              ${verified ? "border-green-400 bg-green-400/5" : "border-accent hover:bg-muted hover:border-primary hover:scale-[1.02]"}`}
            onClick={() => !verified && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            tabIndex={0}
            role="button"
            aria-label="Upload EML file"
          >
            {verified ? (
              <CheckCircle className="text-green-400 h-12 w-12 mb-4 animate-bounce" />
            ) : (
              <Upload className={`h-12 w-12 mb-4 transition-colors duration-200 ${verifying ? "text-yellow-400 animate-pulse" : "text-primary group-hover:text-primary"}`} />
            )}

            <div className={`font-medium text-xl mb-3 ${verified ? "text-green-400" : "text-foreground"}`}>
              {verified ? "Email Verified!" : verifying ? "Verifying..." : "Upload EML File"}
            </div>

            {!verified && (
              <p className="text-muted-foreground mb-6 text-sm max-w-sm text-center leading-relaxed">
                Drag and drop your <strong>.eml</strong> file here or click to browse.
                This step confirms your leak is authentic while keeping you anonymous.
              </p>
            )}

            <input
              ref={inputRef}
              type="file"
              accept=".eml"
              className="hidden"
              onChange={handleChange}
              disabled={verified}
            />

            {fileName && !verified && (
              <div className="text-green-400 font-mono text-sm mb-4 text-center bg-green-400/10 px-3 py-2 rounded">
                ✓ {fileName} accepted
              </div>
            )}

            {error && (
              <div className="text-red-400 font-mono text-sm mb-4 text-center bg-red-400/10 px-3 py-2 rounded">
                {error}
              </div>
            )}

            {verified && (
              <p className="text-green-400 text-sm text-center">
                Proceeding to submission form...
              </p>
            )}

            {!verified && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="px-6 py-3 bg-primary text-background hover:bg-primary/80 hover:scale-105 rounded-lg text-base font-semibold transition-all duration-200 shadow-lg"
                disabled={verifying}
              >
                {verifying ? "Verifying..." : "Choose File"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
