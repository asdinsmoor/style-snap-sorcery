import { useState, useEffect } from "react";
import Navigation from "@/components/ui/navigation";
import UploadZone from "@/components/ui/upload-zone";
import ApiKeySetup from "@/components/ui/api-key-setup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { StyleMatchService } from "@/integrations/supabase/styleMatchService";
import { AnalyzeOutfitResponse, OutfitRecommendation } from "@/types/clothing";

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeOutfitResponse | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Check for stored API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeySet = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
    toast.success("API key saved! You can now analyze outfits.");
  };

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisResult(null);
  };

  const analyzePhoto = async () => {
    if (!uploadedFile || !apiKey) return;
    
    setIsAnalyzing(true);
    
    try {
      // Set the API key in localStorage for the Edge Function to use
      localStorage.setItem('openai_api_key', apiKey);
      
      const result = await StyleMatchService.analyzeOutfit(uploadedFile, apiKey);
      setAnalysisResult(result);
      toast.success("Analysis complete! Here are your AI-powered style recommendations.");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Analysis failed. Please try again or check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show API key setup if not configured
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Button variant="ghost" asChild className="mb-6">
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                AI-Powered Style Analysis
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect your OpenAI API to unlock sophisticated outfit recommendations
              </p>
            </div>
            
            <ApiKeySetup onApiKeySet={handleApiKeySet} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Upload Your Photo
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a clear photo of yourself and let our AI discover your perfect style matches
            </p>
          </div>
          
          {/* Upload Section */}
          <div className="max-w-4xl mx-auto">
            <UploadZone onImageUpload={handleImageUpload} />
            
            {/* Analysis Button */}
            {uploadedFile && !analysisResult && (
              <div className="text-center mt-8">
                <Button
                  onClick={analyzePhoto}
                  disabled={isAnalyzing}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light text-white px-8 py-6 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Your Style...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get Style Recommendations
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="mt-12 text-center">
                <div className="relative max-w-md mx-auto">
                  <div className="bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-accent h-full animate-pulse" style={{ width: "75%" }} />
                  </div>
                  <p className="text-muted-foreground mt-4">
                    AI is analyzing your style preferences...
                  </p>
                </div>
              </div>
            )}
            
            {/* Results Section */}
            {analysisResult && analysisResult.success && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">
                    AI Analysis Results
                  </h2>
                  <div className="max-w-md mx-auto p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6">
                    <h3 className="font-semibold text-lg mb-2">Detected Item</h3>
                    <p className="text-muted-foreground">
                      <strong>Category:</strong> {analysisResult.analysis.category} | 
                      <strong> Gender:</strong> {analysisResult.analysis.gender}
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    Based on advanced AI analysis of your photo, here are personalized recommendations
                  </p>
                </div>
                
                <div className="space-y-8">
                  {analysisResult.recommendations.map((recommendation: OutfitRecommendation, index: number) => (
                    <Card key={index} className="hover-lift border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent" />
                          Matches for: {recommendation.recommendedItem}
                        </CardTitle>
                        <CardDescription>
                          AI-curated items that complement this style
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {recommendation.matches.map((item, itemIndex) => (
                            <div key={itemIndex} className="p-4 rounded-lg bg-gradient-to-br from-secondary/50 to-muted/30 border border-border/50 hover-lift">
                              <h4 className="font-semibold text-foreground mb-2">{item.name}</h4>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p><strong>Style:</strong> {item.style}</p>
                                <p><strong>Color:</strong> {item.color}</p>
                                <p><strong>Category:</strong> {item.category}</p>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => {
                        setUploadedFile(null);
                        setAnalysisResult(null);
                      }}
                      variant="outline"
                      size="lg"
                      className="hover-lift"
                    >
                      Try Another Photo
                    </Button>
                    
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover-lift"
                    >
                      <a 
                        href="https://platform.openai.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Powered by OpenAI
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;