import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyzeImageRequest {
  image: string; // base64 encoded image
  apiKey: string; // OpenAI API key
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  style: string;
  gender: string;
  description: string;
  embedding?: number[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image, apiKey }: AnalyzeImageRequest = await req.json()
    
    // Validate required parameters
    if (!image || !apiKey) {
      throw new Error('Missing required parameters: image and apiKey')
    }

    // Categories from the dataset
    const subcategories = [
      "Shirts", "Jeans", "Dresses", "Skirts", "Jackets", "Blazers", 
      "Tops", "Pants", "Shoes", "Sneakers", "Boots", "Sandals",
      "Accessories", "Bags", "Watches", "Sunglasses"
    ];

    // Analyze the image using GPT-4o mini
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: `Given an image of an item of clothing, analyze the item and generate a JSON output with the following fields: "items", "category", and "gender".
                   Use your understanding of fashion trends, styles, and gender preferences to provide accurate and relevant suggestions for how to complete the outfit.
                   The items field should be a list of items that would go well with the item in the picture. Each item should represent a title of an item of clothing that contains the style, color, and gender of the item.
                   The category needs to be chosen between the types in this list: ${JSON.stringify(subcategories)}.
                   You have to choose between the genders in this list: [Men, Women, Boys, Girls, Unisex]
                   Do not include the description of the item in the picture. Do not include the \`\`\`json \`\`\` tag in the output.

                   Example Input: An image representing a black leather jacket.
                   
                   Example Output: {"items": ["Fitted White Women's T-shirt", "White Canvas Sneakers", "Women's Black Skinny Jeans"], "category": "Jackets", "gender": "Women"}`,
          }, {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`,
            },
          }],
        }],
        max_tokens: 500,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`OpenAI API error: ${analysisResponse.statusText}`)
    }

    const analysisData = await analysisResponse.json()
    const analysisContent = analysisData.choices[0].message.content
    
    let imageAnalysis;
    try {
      imageAnalysis = JSON.parse(analysisContent)
    } catch (error) {
      console.error('Failed to parse analysis result:', analysisContent)
      throw new Error('Invalid analysis response format')
    }

    // Generate embeddings for the recommended items
    const embeddingPromises = imageAnalysis.items.map(async (item: string) => {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: item,
          model: "text-embedding-3-large",
        }),
      });

      if (!embeddingResponse.ok) {
        throw new Error(`Embedding API error: ${embeddingResponse.statusText}`)
      }

      const embeddingData = await embeddingResponse.json()
      return {
        item,
        embedding: embeddingData.data[0].embedding
      }
    });

    const itemEmbeddings = await Promise.all(embeddingPromises)

    // Create mock database of clothing items with embeddings
    const mockClothingDatabase: ClothingItem[] = [
      {
        id: "1",
        name: "Classic White Button-Down Shirt",
        category: "Shirts",
        color: "White",
        style: "Classic",
        gender: "Unisex",
        description: "Timeless white cotton shirt perfect for professional and casual looks"
      },
      {
        id: "2", 
        name: "Dark Wash Skinny Jeans",
        category: "Jeans",
        color: "Dark Blue",
        style: "Skinny",
        gender: "Women",
        description: "Flattering dark wash jeans with stretch for comfort and style"
      },
      {
        id: "3",
        name: "Black Leather Ankle Boots",
        category: "Boots",
        color: "Black",
        style: "Ankle",
        gender: "Women",
        description: "Versatile black leather boots suitable for multiple occasions"
      },
      {
        id: "4",
        name: "Cashmere V-Neck Sweater",
        category: "Tops",
        color: "Beige",
        style: "V-Neck",
        gender: "Women",
        description: "Luxurious cashmere sweater in neutral beige tone"
      },
      {
        id: "5",
        name: "Tailored Navy Blazer",
        category: "Blazers",
        color: "Navy",
        style: "Tailored",
        gender: "Unisex",
        description: "Professional navy blazer perfect for business attire"
      },
      {
        id: "6",
        name: "White Canvas Sneakers",
        category: "Sneakers",
        color: "White",
        style: "Classic",
        gender: "Unisex",
        description: "Clean white canvas sneakers for casual everyday wear"
      }
    ];

    // Generate embeddings for mock database items
    const databaseEmbeddingPromises = mockClothingDatabase.map(async (item) => {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: item.description,
          model: "text-embedding-3-large",
        }),
      });

      if (!embeddingResponse.ok) {
        throw new Error(`Database embedding API error: ${embeddingResponse.statusText}`)
      }

      const embeddingData = await embeddingResponse.json()
      return {
        ...item,
        embedding: embeddingData.data[0].embedding
      }
    });

    const databaseWithEmbeddings = await Promise.all(databaseEmbeddingPromises)

    // Cosine similarity function
    function cosineSimilarity(vecA: number[], vecB: number[]): number {
      const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return dotProduct / (normA * normB);
    }

    // Find similar items for each recommended item
    const recommendations = itemEmbeddings.map(({ item, embedding }) => {
      const similarities = databaseWithEmbeddings.map((dbItem, index) => ({
        index,
        similarity: cosineSimilarity(embedding, dbItem.embedding!),
        item: dbItem
      }));

      const topMatches = similarities
        .filter(s => s.similarity >= 0.5)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)
        .map(s => s.item);

      return {
        recommendedItem: item,
        matches: topMatches
      };
    });

    return new Response(
      JSON.stringify({
        analysis: imageAnalysis,
        recommendations: recommendations,
        success: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in analyze-outfit function:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})