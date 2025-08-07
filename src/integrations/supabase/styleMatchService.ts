import { supabase } from './client';
import { AnalyzeOutfitResponse } from '@/types/clothing';

export class StyleMatchService {
  static async analyzeOutfit(imageFile: File, apiKey: string): Promise<AnalyzeOutfitResponse> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-outfit', {
        body: { image: base64Image, apiKey }
      });

      if (error) {
        throw new Error(`Supabase function error: ${error.message}`);
      }

      return data as AnalyzeOutfitResponse;
    } catch (error) {
      console.error('Error analyzing outfit:', error);
      throw error;
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}