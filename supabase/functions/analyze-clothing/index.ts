import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clothing categories for matching
const CLOTHING_CATEGORIES = [
  "Shirts", "Jeans", "Dresses", "Tops", "Tshirts", "Casual Shoes", "Watches", "Sports Shoes",
  "Kurtas", "Heels", "Handbags", "Flip Flops", "Sandals", "Shorts", "Sweatshirts", "Flats",
  "Formal Shoes", "Sunglasses", "Jackets", "Belts", "Sarees", "Sweaters", "Trousers", "Wallets"
];

const GENDERS = ["Men", "Women", "Boys", "Girls", "Unisex"];

interface ClothingAnalysis {
  items: string[];
  category: string;
  gender: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, filename } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Analyzing clothing image: ${filename || 'unnamed'}`);

    // Analyze the image using OpenAI GPT-4o-mini
    const analysis = await analyzeClothingImage(image, openaiApiKey);
    
    // Generate style recommendations based on analysis
    const recommendations = generateRecommendations(analysis);

    console.log('Analysis completed successfully:', { analysis, recommendations });

    return new Response(JSON.stringify({ 
      analysis,
      recommendations 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-clothing function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Analysis failed',
      recommendations: getDefaultRecommendations() // Fallback recommendations
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeClothingImage(imageBase64: string, apiKey: string): Promise<ClothingAnalysis> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Given an image of an item of clothing, analyze the item and generate a JSON output with the following fields: "items", "category", and "gender".
                     Use your understanding of fashion trends, styles, and gender preferences to provide accurate and relevant suggestions for how to complete the outfit.
                     The items field should be a list of items that would go well with the item in the picture. Each item should represent a title of an item of clothing that contains the style, color, and gender of the item.
                     The category needs to be chosen between the types in this list: ${JSON.stringify(CLOTHING_CATEGORIES)}.
                     You have to choose between the genders in this list: ${JSON.stringify(GENDERS)}
                     Do not include the description of the item in the picture. Do not include the \`\`\`json \`\`\` tag in the output.

                     Example Input: An image representing a black leather jacket.

                     Example Output: {"items": ["Fitted White Women's T-shirt", "White Canvas Sneakers", "Women's Black Skinny Jeans"], "category": "Jackets", "gender": "Women"}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            }
          ],
        }
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Invalid response format from OpenAI');
  }
}

function generateRecommendations(analysis: ClothingAnalysis) {
  const recommendations = [];
  
  // Group items by category
  const categoryMap: { [key: string]: string[] } = {
    "Tops": [],
    "Bottoms": [], 
    "Outerwear": [],
    "Accessories": []
  };

  // Categorize the analyzed items
  analysis.items.forEach(item => {
    const lowerItem = item.toLowerCase();
    
    if (lowerItem.includes('shirt') || lowerItem.includes('blouse') || lowerItem.includes('top') || 
        lowerItem.includes('sweater') || lowerItem.includes('t-shirt')) {
      categoryMap["Tops"].push(item);
    } else if (lowerItem.includes('jean') || lowerItem.includes('trouser') || lowerItem.includes('pant') || 
               lowerItem.includes('skirt') || lowerItem.includes('short')) {
      categoryMap["Bottoms"].push(item);
    } else if (lowerItem.includes('jacket') || lowerItem.includes('coat') || lowerItem.includes('blazer')) {
      categoryMap["Outerwear"].push(item);
    } else {
      categoryMap["Accessories"].push(item);
    }
  });

  // Create recommendations for each category that has items
  Object.entries(categoryMap).forEach(([category, items]) => {
    if (items.length > 0) {
      recommendations.push({
        category,
        items: items.slice(0, 3) // Limit to 3 items per category
      });
    }
  });

  // If no items were categorized, provide default recommendations
  if (recommendations.length === 0) {
    return getDefaultRecommendations();
  }

  return recommendations;
}

function getDefaultRecommendations() {
  return [
    {
      category: "Tops",
      items: ["Classic White Button-Down Shirt", "Soft Cashmere Sweater", "Elegant Silk Blouse"]
    },
    {
      category: "Bottoms", 
      items: ["High-Waisted Dark Jeans", "Tailored Black Trousers", "Flowing Midi Skirt"]
    },
    {
      category: "Outerwear",
      items: ["Timeless Trench Coat", "Structured Blazer", "Cozy Wool Cardigan"]
    },
    {
      category: "Accessories",
      items: ["Leather Crossbody Bag", "Classic Pearl Earrings", "Silk Square Scarf"]
    }
  ];
}