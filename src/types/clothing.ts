export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  style: string;
  gender: string;
  description: string;
}

export interface ImageAnalysis {
  items: string[];
  category: string;
  gender: string;
}

export interface OutfitRecommendation {
  recommendedItem: string;
  matches: ClothingItem[];
}

export interface AnalyzeOutfitResponse {
  analysis: ImageAnalysis;
  recommendations: OutfitRecommendation[];
  success: boolean;
  error?: string;
}