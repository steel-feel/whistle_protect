
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
  <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-muted via-primary/50 to-muted"></div>
        
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
                      ? 'border-primary bg-primary text-background scale-110 shadow-lg shadow-primary/25'
                      : hoveredEvent === event.year
                      ? 'border-primary/70 bg-card text-foreground scale-105'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:scale-105'
                  }`}
                >
                  {event.year}
                </div>
                <div className="mt-4 text-center max-w-32 transition-all duration-300">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    selectedEvent?.year === event.year || hoveredEvent === event.year
                      ? 'text-primary'
                      : 'text-muted-foreground'
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
        <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 animate-fade-in">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-3xl font-bold text-foreground">
                    {selectedEvent.title}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`border-primary ${getStatusColor(selectedEvent.status)} flex items-center space-x-1 px-3 py-1`}
                  >
                    {getStatusIcon(selectedEvent.status)}
                    <span>{selectedEvent.year}</span>
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-destructive flex items-center space-x-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Consequences</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed pl-7">{selectedEvent.outcome}</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 flex items-center space-x-2 text-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>Impact</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed pl-7">{selectedEvent.impact}</p>
              </div>
            </div>

            {selectedEvent.learnMoreUrl && (
              <div className="mt-8 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200"
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
        <Card className="bg-card border-border border-dashed">
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Click on any event above to explore its story and impact
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
