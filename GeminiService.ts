
import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt, THEME_COLORS } from "./constants";

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateStyleVariation(
    base64Image: string,
    stylePrompt: string,
    colorThemeIndex: number = 0,
    size: "1K" | "2K" | "4K" = "1K"
  ): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: this.apiKey });
    const theme = THEME_COLORS[colorThemeIndex];
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: `${getSystemPrompt(theme.name, theme.hex, theme.bg)}\n\nVariation Style Task: Render the provided subject using this specific technique: "${stylePrompt}". \n\nCRITICAL: Do not change the character's pose, silhouette, or direction. ONLY change the texture/rendering style to match the task.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from model");
  }
}
