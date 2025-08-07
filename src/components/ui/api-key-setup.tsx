import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsValidating(true);
    
    // Simple validation - check if it looks like an OpenAI API key
    if (apiKey.startsWith('sk-') && apiKey.length > 20) {
      onApiKeySet(apiKey);
    } else {
      alert("Please enter a valid OpenAI API key (starts with 'sk-')");
    }
    
    setIsValidating(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="hover-lift border-primary/20">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <Key className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl gradient-text">Setup Required</CardTitle>
          <CardDescription>
            Enter your OpenAI API key to enable AI-powered outfit analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Your API key is stored locally and never sent to our servers.</p>
                <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI's platform</a>.</p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light"
              disabled={!apiKey.trim() || isValidating}
            >
              {isValidating ? "Validating..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySetup;