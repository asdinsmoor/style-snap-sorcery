import { useState } from "react";
import Navigation from "@/components/ui/navigation";
import UploadZone from "@/components/ui/upload-zone";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { OpenAIService, StyleRecommendations } from "@/services/openai";

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<StyleRecommendations[]>([]);

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisComplete(false);
  };

  const analyzePhoto = async () => {
    if (!uploadedFile) return;
    
    // Validate file
    if (!OpenAIService.isValidImageFile(uploadedFile)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }
    
    if (!OpenAIService.isValidFileSize(uploadedFile)) {
      toast.error("File size must be under 5MB");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const styleRecommendations = await OpenAIService.analyzeClothingImage(uploadedFile);
      setRecommendations(styleRecommendations);
      setAnalysisComplete(true);
      toast.success("Analysis complete! Here are your AI-powered style recommendations.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze image. Please try again.");
      // Use fallback recommendations on error
      setRecommendations(getMockRecommendations());
      setAnalysisComplete(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMockRecommendations = (): StyleRecommendations[] => [
    {
      category: "Tops",
      items: ["Silk Blouse in Emerald", "Cashmere Sweater in Cream", "Cotton Shirt in Navy"]
    },
    {
      category: "Bottoms", 
      items: ["High-waisted Trousers in Charcoal", "Midi Skirt in Camel", "Dark Wash Jeans"]
    },
    {
      category: "Outerwear",
      items: ["Wool Coat in Camel", "Leather Jacket in Black", "Blazer in Navy"]
    },
    {
      category: "Accessories",
      items: ["Gold Statement Necklace", "Leather Handbag in Tan", "Silk Scarf in Floral"]
    }
  ];

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
            {uploadedFile && !analysisComplete && (
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
            {analysisComplete && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">
                    Your Style Recommendations
                  </h2>
                  <p className="text-muted-foreground">
                    Based on your photo analysis, here are our curated suggestions
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {recommendations.map((category, index) => (
                    <div key={index} className="hover-lift">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-card via-secondary/50 to-card border border-border/50">
                        <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent" />
                          {category.category}
                        </h3>
                        <ul className="space-y-3">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-muted-foreground flex items-center gap-3">
                              <Sparkles className="w-4 h-4 text-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button
                    onClick={() => {
                      setUploadedFile(null);
                      setAnalysisComplete(false);
                      setRecommendations([]);
                    }}
                    variant="outline"
                    size="lg"
                    className="hover-lift"
                  >
                    Try Another Photo
                  </Button>
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