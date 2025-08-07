import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fashion.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Fashion Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/80 to-primary-glow/70" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="animate-float">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-accent-light" />
            <span className="text-accent-light font-medium tracking-wider uppercase text-sm">
              AI-Powered Fashion
            </span>
            <Sparkles className="w-6 h-6 text-accent-light" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Perfect Your
            <br />
            <span className="text-accent-light">Style Match</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Upload your photo and discover clothing combinations that complement your unique style and personality
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              asChild
              className="group bg-white text-primary hover:bg-white/90 hover-lift text-lg px-8 py-6 rounded-xl"
            >
              <Link to="/upload" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="group border-white/30 text-white hover:bg-white/10 hover-lift text-lg px-8 py-6 rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-accent-light/30 rounded-full animate-pulse hidden md:block" />
      <div className="absolute bottom-40 left-20 w-6 h-6 bg-primary-glow/40 rounded-full animate-bounce hidden md:block" />
      <div className="absolute top-1/2 right-40 w-3 h-3 bg-white/30 rounded-full animate-ping hidden lg:block" />
    </section>
  );
};

export default HeroSection;