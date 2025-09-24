
import { Link } from "react-router-dom";

const Manifesto = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-['Inter',sans-serif]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Back to Home Link */}
        <div className="mb-16">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-gray-100 transition-colors duration-200 font-medium"
          >
            Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Truth Without Trust
          </h1>

          <div className="space-y-6 leading-relaxed">
            <p className="text-lg">
              Power hoards information. Elites control narratives. The masses choose blindly from curated lies.
            </p>

            <p className="text-lg">
              True freedom demands informed choice. But information flows only where power permits—until now.
            </p>

            <p className="text-lg">
              We shatter information monopolies through cryptography. Zero-knowledge proofs verify insider credibility without revealing identity. Blockchain attestations prove evidence authenticity without gatekeepers. No institutions. No intermediaries.
            </p>

            <p className="text-lg">
              Every citizen deserves access to truth. Every whistleblower deserves mathematical protection. Every choice deserves complete information.
            </p>

            <p className="text-lg">
              The gatekeepers built walls around truth. We built cryptographic tunnels through them.
            </p>

            <p className="text-lg font-semibold text-[#3FB8AF] mt-12">
              Speak truth. Stay protected. Choose freely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
