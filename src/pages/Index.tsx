import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import FeatureCard from "@/components/ui/feature-card";
import { Sparkles, Brain, Palette, Zap } from "lucide-react";
import outfitImage from "@/assets/outfit-matching.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our advanced AI analyzes your photo to understand your style, body type, and color preferences.",
      gradient: "from-primary to-accent"
    },
    {
      icon: Palette,
      title: "Color Harmony",
      description: "Get recommendations based on color theory and what complements your natural tones.",
      gradient: "from-accent to-primary-glow"
    },
    {
      icon: Sparkles,
      title: "Personalized Matches",
      description: "Receive curated clothing suggestions tailored specifically to your unique aesthetic.",
      gradient: "from-primary-glow to-primary"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get your style recommendations in seconds with our lightning-fast processing.",
      gradient: "from-accent-light to-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              How StyleMatch Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of fashion with our AI-powered styling technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
                Discover Your Perfect
                <br />
                <span className="gradient-text">Style Identity</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                StyleMatch revolutionizes how you approach fashion by using cutting-edge AI to analyze your unique features and preferences. Our technology considers everything from your skin tone and body type to your personal style preferences.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Smart Analysis</h3>
                    <p className="text-muted-foreground">Advanced computer vision analyzes your photo to understand your unique characteristics.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-accent to-primary-glow flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Curated Recommendations</h3>
                    <p className="text-muted-foreground">Get personalized clothing suggestions from top fashion brands and styles.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-glow to-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Style Evolution</h3>
                    <p className="text-muted-foreground">Learn and refine your style preferences over time for better matches.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden hover-lift">
                <img 
                  src={outfitImage} 
                  alt="Fashion Matching Concept" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full opacity-60 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-glow rounded-full opacity-40 animate-bounce" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
