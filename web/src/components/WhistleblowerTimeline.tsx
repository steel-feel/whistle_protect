
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  outcome: string;
  impact: string;
  status: 'positive' | 'negative' | 'mixed';
  learnMoreUrl?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2010",
    title: "WikiLeaks Diplomatic Cables",
    description: "250,000 diplomatic cables revealed global surveillance and corruption patterns across embassies worldwide.",
    outcome: "Assange sought asylum, Manning imprisoned 7 years, legal proceedings ongoing",
    impact: "Exposed diplomatic duplicity, sparked global debate on transparency and press freedom",
    status: 'mixed'
  },
  {
    year: "2013",
    title: "Snowden NSA Revelations",
    description: "Mass surveillance programs exposed by NSA contractor, revealing unprecedented government overreach.",
    outcome: "Snowden granted asylum in Russia, faces espionage charges if returned to US",
    impact: "Reformed surveillance laws worldwide, increased encryption adoption, enhanced privacy awareness",
    status: 'positive'
  },
  {
    year: "2016",
    title: "Panama Papers",
    description: "11.5M documents revealed offshore tax avoidance schemes involving world leaders and celebrities.",
    outcome: "Journalist Daphne Caruana Galizia killed, multiple arrests and government resignations",
    impact: "$1.36B recovered in taxes globally, new transparency regulations enacted",
    status: 'mixed'
  },
  {
    year: "2017",
    title: "Paradise Papers",
    description: "13.4M documents exposed more sophisticated offshore financial activities and tax engineering.",
    outcome: "Ongoing investigations, regulatory reforms, increased scrutiny of tax havens",
    impact: "Enhanced scrutiny of offshore finance, policy changes in multiple jurisdictions",
    status: 'positive'
  },
  {
    year: "2021",
    title: "Facebook Papers",
    description: "Internal documents revealed platform's knowledge of harmful effects on democracy and mental health.",
    outcome: "Frances Haugen testified to Congress, ongoing regulatory pressure and investigations",
    impact: "Increased platform accountability measures, content moderation reforms, regulatory action",
    status: 'positive'
  }
];

export const WhistleblowerTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(timelineEvents[1]);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-400 bg-green-400/10';
      case 'negative': return 'text-red-400 bg-red-400/10';
      case 'mixed': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive': return <CheckCircle className="h-4 w-4" />;
      case 'negative': return <AlertTriangle className="h-4 w-4" />;
      case 'mixed': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Interactive Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-800 via-[#3FB8AF]/50 to-gray-800"></div>
        
        <div className="flex justify-between items-start relative">
          {timelineEvents.map((event, index) => (
            <div
              key={event.year}
              className="flex-1 cursor-pointer group"
              onClick={() => setSelectedEvent(event)}
              onMouseEnter={() => setHoveredEvent(event.year)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <div className="flex flex-col items-center">
                <div 
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-sm transition-all duration-300 transform ${
                    selectedEvent?.year === event.year
                      ? 'border-[#3FB8AF] bg-[#3FB8AF] text-[#0D1117] scale-110 shadow-lg shadow-[#3FB8AF]/25'
                      : hoveredEvent === event.year
                      ? 'border-[#3FB8AF]/70 bg-[#161B22] text-white scale-105'
                      : 'border-gray-600 bg-[#161B22] text-gray-300 hover:border-[#3FB8AF]/50 hover:scale-105'
                  }`}
                >
                  {event.year}
                </div>
                <div className="mt-4 text-center max-w-32 transition-all duration-300">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    selectedEvent?.year === event.year || hoveredEvent === event.year
                      ? 'text-[#3FB8AF]'
                      : 'text-gray-400'
                  }`}>
                    {event.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent && (
        <Card className="bg-[#161B22] border-gray-700 hover:border-[#3FB8AF]/50 transition-all duration-300 animate-fade-in">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-3xl font-bold text-white">
                    {selectedEvent.title}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`border-[#3FB8AF] ${getStatusColor(selectedEvent.status)} flex items-center space-x-1 px-3 py-1`}
                  >
                    {getStatusIcon(selectedEvent.status)}
                    <span>{selectedEvent.year}</span>
                  </Badge>
                </div>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-red-400 flex items-center space-x-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Consequences</span>
                </h4>
                <p className="text-gray-400 leading-relaxed pl-7">{selectedEvent.outcome}</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-400 flex items-center space-x-2 text-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>Impact</span>
                </h4>
                <p className="text-gray-400 leading-relaxed pl-7">{selectedEvent.impact}</p>
              </div>
            </div>

            {selectedEvent.learnMoreUrl && (
              <div className="mt-8 pt-6 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  className="border-[#3FB8AF] text-[#3FB8AF] hover:bg-[#3FB8AF] hover:text-[#0D1117] transition-all duration-200"
                  asChild
                >
                  <a href={selectedEvent.learnMoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Learn More</span>
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedEvent && (
        <Card className="bg-[#161B22] border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Click on any event above to explore its story and impact
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
