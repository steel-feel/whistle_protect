
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Gavel, Globe, Newspaper, Lock, Shield } from "lucide-react";

const PrivateSubmissionOptions = () => {
  const verifiedGroups = [
    {
      title: "Investigative Journalists",
      description: "Submit leaks to verified reporters and media organizations",
      icon: Newspaper,
      count: "42 verified",
      comingSoon: true
    },
    {
      title: "Legal Forums",
      description: "Share evidence with legal professionals and advocacy groups", 
      icon: Gavel,
      count: "28 verified",
      comingSoon: true
    },
    {
      title: "NGOs & Watchdogs",
      description: "Connect with non-profit organizations and transparency advocates",
      icon: Shield,
      count: "73 verified", 
      comingSoon: true
    },
    {
      title: "Domain Experts",
      description: "Industry specialists who can verify technical claims",
      icon: Users,
      count: "13 verified",
      comingSoon: true
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">Submit Leak to Verified Groups</h2>
        <p className="text-xl text-gray-100 max-w-2xl mx-auto mb-2">
          Choose to disclose
        </p>
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          <Badge variant="outline" className="border-[#3FB8AF] text-[#3FB8AF] px-4 py-2 text-base font-medium">
            <Lock className="h-4 w-4 mr-2" />
            156 verified groups
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {verifiedGroups.map((group, index) => (
          <Card key={index} className="bg-[#161B22] border-gray-700 hover:border-[#3FB8AF]/50 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#3FB8AF]/10 rounded-lg group-hover:bg-[#3FB8AF]/20 transition-colors duration-300">
                    <group.icon className="h-6 w-6 text-[#3FB8AF]" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-semibold">{group.title}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{group.count}</p>
                  </div>
                </div>
                {group.comingSoon && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                    Coming Soon
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-100 leading-relaxed">{group.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-sm">
          All private submissions are encrypted end-to-end and only accessible to verified group members
        </p>
      </div>
    </div>
  );
};

export { PrivateSubmissionOptions };
