import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradient = "from-primary to-accent" }: FeatureCardProps) => {
  return (
    <div className="group hover-lift">
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card via-secondary/50 to-card border border-border/50 h-full">
        {/* Gradient background on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;