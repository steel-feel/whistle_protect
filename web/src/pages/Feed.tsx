import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Search, Filter, ExternalLink, Clock, CheckCircle, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ky from 'ky';
import { moduleAddress, aptos } from "@/lib/constants";

interface Tip {
  id: string;
  status: 'verified' | 'pending' | 'disputed';
  date: Date;
  title: string,
  content: string;
  category: string;
  attestations: number;
  domain: string
}

const Feed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tips, setTips] = useState<Tip[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { toast } = useToast();

  const categories = ['all', 'Privacy', 'Finance', 'Healthcare', 'NGO', 'Government', 'Corporate'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      case 'disputed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };
  // const gateway = import.meta.env.PUBLIC_GATEWAY;

  const getFeedFromGateway = async () => {

    //get the number of entries
    const payload = {
      function: `${moduleAddress}::smart_table::get_messages_len`,
      typeArguments: [], // No type arguments for this function
      functionArguments: [], // The address to check the balance of
    };

    const result = await aptos.view({
      //@ts-ignore
      payload,
    });
    // console.log({ result });

    //@ts-ignore
    const len = parseInt(result[0]);
    let p2, r2, pData;
    let feeds = []
    for (let i = 1; i <= len; i++) {
      p2 = {
        function: `${moduleAddress}::smart_table::get_message`,
        typeArguments: [], // No type arguments for this function
        functionArguments: [i], // The address to check the balance of
      };
      try {
        r2 = await aptos.view({
          //@ts-ignore
          payload: p2,
        });
        console.log({ r2 });

        pData = JSON.parse(r2[0])
        if(pData.date == undefined) {
          continue
        }
        pData.id = "" + i
        pData.date = new Date(pData.date)

        feeds.push(pData)
      } catch (err) {
        console.error(err)
      }

    }

    return feeds
  }

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      console.log('Loading initial data...');
      const initialTips = await getFeedFromGateway();
      console.log('Setting initial tips:', initialTips);
      setTips(initialTips);

      // If we have at least 2 tips, stop showing loading state
      if (initialTips.length >= 1) {
        setIsLoading(false);
      }

      // Continue fetching in background
      fetchMoreData();
    } catch (error) {
      console.error('Error fetching initial tips:', error);
      toast({
        title: "Error",
        description: "Failed to load tips. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      // Fetch new events
      const newTips = []

      if (newTips.length > 0) {
        setTips(prevTips => {
          // Combine new tips with existing ones, avoiding duplicates
          const existingIds = new Set(prevTips.map(tip => tip.id));
          const uniqueNewTips = newTips.filter(tip => !existingIds.has(tip.id));
          return [...prevTips, ...uniqueNewTips];
        });
      }
    } catch (error) {
      console.error('Error fetching more tips:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Set up polling for new tips every 30 seconds
    const pollInterval = setInterval(fetchMoreData, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyCID = (cid: string) => {
    navigator.clipboard.writeText(cid);
    toast({
      title: "CID Copied",
      description: "Content identifier has been copied to clipboard",
    });
  };

  return (
  <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif]">
      {/* Header */}
  <header className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Whistle Protect</span>
          </Link>

        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search tips, categories, or keywords..."
              className="pl-12 bg-card border-border text-foreground placeholder-muted-foreground h-12 rounded-lg font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === category
                    ? "bg-primary text-background font-medium px-4 py-2 rounded-lg"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground font-medium px-4 py-2 rounded-lg transition-all duration-200"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <Card className="bg-card border-border">
              <CardContent className="p-16 text-center">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-6 animate-spin" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">Loading tips...</h3>
                <p className="text-muted-foreground text-lg">Please wait while we fetch the latest tips</p>
              </CardContent>
            </Card>
          ) : filteredTips.length > 0 ? (
            <>
              {filteredTips.map((tip) => (
                <Card key={tip.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-wrap gap-2">
                        <Badge
                          className={`${getStatusColor(tip.status)} flex items-center space-x-1 px-3 py-1 rounded-full font-medium`}
                        >
                          {getStatusIcon(tip.status)}
                          <span className="capitalize">{tip.status}</span>
                        </Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground px-3 py-1 rounded-full">
                          {tip.category}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1 rounded-full">
                          {tip.domain}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-medium">{tip.date.toDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground font-medium">{tip.attestations} attestations</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 group-hover:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-gray-400 break-all">{tip.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCID(tip.id)}
                            className="ml-2 h-8 w-8 p-0 hover:bg-gray-800"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div> */}

                      <div>
                        <CardTitle className="text-foreground text-lg font-semibold">{tip.title}</CardTitle>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-md">{tip.content}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex space-x-3">
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200 px-6 py-2 rounded-lg font-medium"
                          >
                            Attest (Coming soon)
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200 px-6 py-2 rounded-lg font-medium"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {isFetchingMore && (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-gray-500 mx-auto animate-spin" />
                  <p className="text-gray-400 mt-2">Fetching more tips...</p>
                </div>
              )}
            </>
          ) : (
            <Card className="bg-card border-border border-dashed">
              <CardContent className="p-16 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">No tips found</h3>
                <p className="text-muted-foreground text-lg">Try adjusting your search terms or category filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
