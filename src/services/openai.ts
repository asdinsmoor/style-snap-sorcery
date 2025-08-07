import { supabase } from "@/integrations/supabase/client";

export interface ClothingAnalysis {
  items: string[];
  category: string;
  gender: string;
}

export interface StyleRecommendations {
  category: string;
  items: string[];
}

export class OpenAIService {
  /**
   * Analyzes a clothing image and returns style recommendations
   */
  static async analyzeClothingImage(file: File): Promise<StyleRecommendations[]> {
    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(file);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-clothing', {
        body: { 
          image: base64Image,
          filename: file.name 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      return data.recommendations || [];
    } catch (error) {
      console.error('OpenAI service error:', error);
      throw error;
    }
  }

  /**
   * Converts a File object to base64 string
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Validates if the file is a supported image format
   */
  static isValidImageFile(file: File): boolean {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return supportedTypes.includes(file.type);
  }

  /**
   * Validates file size (max 5MB)
   */
  static isValidFileSize(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }
}