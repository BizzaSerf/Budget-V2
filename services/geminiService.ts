
import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES } from '../constants';
import { Category } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function categorizeTransaction(description: string): Promise<Category> {
  if (!description.trim()) {
    return Category.Other;
  }

  const prompt = `Categorize the following expense description into one of the provided categories.
Description: "${description}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: `The expense category. Must be one of: ${CATEGORIES.join(", ")}.`,
              enum: CATEGORIES,
            },
          },
          required: ["category"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    const category = result.category as Category;
    
    // Validate if the returned category is one of our predefined categories
    if (CATEGORIES.includes(category)) {
      return category;
    }
    
    console.warn(`Gemini returned an unknown category: ${category}`);
    return Category.Other;

  } catch (error) {
    console.error("Error categorizing transaction with Gemini:", error);
    // Fallback to a default category in case of an API error
    return Category.Other;
  }
}
