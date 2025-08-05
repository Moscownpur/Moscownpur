import { GoogleGenAI } from "@google/genai";

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY not found in environment variables');
}

// Create AI client only when we have an API key
const getGenAI = () => {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }
  
  // Validate API key format (should start with AI)
  if (!apiKey.startsWith('AI')) {
    throw new Error('Invalid API key format. Should start with "AI"');
  }
  
  try {
    // Use the configuration object approach that works in browsers
    return new GoogleGenAI({
      apiKey: apiKey
    });
  } catch (error) {
    console.error('Error creating GoogleGenAI client:', error);
    throw error;
  }
};

// Utility function for text generation
export const generateText = async (
  prompt: string,
  model: string = "gemini-2.5-flash"
): Promise<string> => {
  try {
    const genAI = getGenAI();
    
    // Use the working method we discovered
    const result = await genAI.models.generateContent({
      model,
      contents: [{ text: prompt }]
    });
    
    return result.text;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
};

// Utility function for image generation
export const generateImage = async (
  prompt: string,
  numberOfImages: number = 1,
  model: string = 'imagen-4.0-generate-preview-06-06'
): Promise<string[]> => {
  try {
    const genAI = getGenAI();
    const result = await genAI.models.generateImages({
      model,
      prompt,
      config: { numberOfImages },
    });

    return result.images.map(img => img.base64 || '');
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

// Utility function for scene suggestions
export const generateSceneSuggestion = async (
  worldContext: string,
  characterContext: string,
  plotContext: string
): Promise<string> => {
  const prompt = `
    Based on the following context, suggest an engaging scene for a story:
    
    World Context: ${worldContext}
    Character Context: ${characterContext}
    Plot Context: ${plotContext}
    
    Please provide:
    1. A brief scene description
    2. Suggested dialogue starters
    3. Key emotional beats
    4. Potential plot developments
    
    Keep it concise but creative.
  `;

  return generateText(prompt);
};

// Utility function for dialogue drafting
export const generateDialogue = async (
  characterName: string,
  characterRole: string,
  sceneContext: string,
  emotion: string = 'neutral'
): Promise<string> => {
  const prompt = `
    Generate dialogue for a character in a scene:
    
    Character: ${characterName} (${characterRole})
    Scene Context: ${sceneContext}
    Emotion: ${emotion}
    
    Please write 2-3 lines of dialogue that:
    - Fits the character's role and personality
    - Advances the scene
    - Reflects the specified emotion
    - Sounds natural and engaging
    
    Format: Just the dialogue text, no character name prefix.
  `;

  return generateText(prompt);
};

// Utility function for plot continuation
export const generatePlotContinuation = async (
  currentPlot: string,
  worldContext: string,
  characters: string[]
): Promise<string> => {
  const prompt = `
    Continue the plot based on the current story:
    
    Current Plot: ${currentPlot}
    World Context: ${worldContext}
    Available Characters: ${characters.join(', ')}
    
    Please suggest:
    1. The next logical plot development
    2. How characters might react
    3. Potential conflicts or resolutions
    4. Ways to maintain reader engagement
    
    Keep suggestions concise but detailed enough to be actionable.
  `;

  return generateText(prompt);
};

// Test function to verify API connection
export const testAIConnection = async (): Promise<{ success: boolean; message: string; response?: string }> => {
  try {
    if (!apiKey) {
      return {
        success: false,
        message: 'GEMINI_API_KEY not found in environment variables'
      };
    }

    const response = await generateText('Say "Hello! AI integration is working correctly." in exactly 10 words.');
    
    return {
      success: true,
      message: 'AI connection successful',
      response
    };
  } catch (error) {
    console.error('Error in testAIConnection:', error);
    return {
      success: false,
      message: `AI connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 