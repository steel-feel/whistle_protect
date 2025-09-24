
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  trend: string;
}

export const StatsSection = () => {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Tips Submitted",
      value: 0,
      suffix: "",
      icon: <FileText className="h-6 w-6 text-[#3FB8AF]" />,
      trend: "+12 today"
    },
    {
      label: "Verified Attestations",
      value: 0,
      suffix: "",
      icon: <Shield className="h-6 w-6 text-[#3FB8AF]" />,
      trend: "+5 today" 
    },
    {
      label: "Public Disclosures",
      value: 0,
      suffix: "",
      icon: <TrendingUp className="h-6 w-6 text-[#3FB8AF]" />,
      trend: "+2 today"
    },
    {
      label: "Active Verifiers",
      value: 0,
      suffix: "",
      icon: <Users className="h-6 w-6 text-[#3FB8AF]" />,
      trend: "+8 online"
    }
  ]);

  // Animate numbers on load
  useEffect(() => {
    const targetValues = [2847, 1264, 89, 156];
    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats(prevStats => prevStats.map((stat, index) => ({
        ...stat,
        value: Math.floor(targetValues[index] * progress)
      })));

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(prevStats => prevStats.map((stat, index) => ({
          ...stat,
          value: targetValues[index]
        })));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
        <p className="text-gray-400 text-lg">Real-time metrics from our decentralized network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="bg-[#161B22] border-gray-800 hover:border-[#3FB8AF] transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                {stat.icon}
                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-[#C9D1D9]">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#161B22] border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-semibold mb-2">Network Health</h3>
              <p className="text-gray-400">Distributed across 23 countries, 156 active nodes</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Operational</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
