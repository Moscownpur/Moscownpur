//hi
import React, { useState } from 'react';
import { 
  testAIConnection, 
  generateText, 
  generateSceneSuggestion, 
  generateDialogue, 
  generatePlotContinuation 
} from '../lib/ai';
import toast from 'react-hot-toast';

const AITest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    connection?: { success: boolean; message: string; response?: string };
    textGeneration?: string;
    sceneSuggestion?: string;
    dialogue?: string;
    plotContinuation?: string;
  }>({});

  const handleConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testAIConnection();
      setTestResults(prev => ({ ...prev, connection: result }));
      
      if (result.success) {
        toast.success('AI Connection Test: SUCCESS!');
      } else {
        toast.error(`AI Connection Test: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextGenerationTest = async () => {
    setIsLoading(true);
    try {
      const response = await generateText('Write a creative story opening in exactly 2 sentences.');
      setTestResults(prev => ({ ...prev, textGeneration: response }));
      toast.success('Text Generation Test: SUCCESS!');
    } catch (error) {
      toast.error(`Text generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSceneSuggestionTest = async () => {
    setIsLoading(true);
    try {
      const response = await generateSceneSuggestion(
        'A medieval fantasy world with magic and dragons',
        'A brave knight and a wise wizard',
        'They are searching for a lost artifact'
      );
      setTestResults(prev => ({ ...prev, sceneSuggestion: response }));
      toast.success('Scene Suggestion Test: SUCCESS!');
    } catch (error) {
      toast.error(`Scene suggestion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogueTest = async () => {
    setIsLoading(true);
    try {
      const response = await generateDialogue(
        'Sir Galahad',
        'Hero',
        'Standing at the entrance of a dark cave',
        'determined'
      );
      setTestResults(prev => ({ ...prev, dialogue: response }));
      toast.success('Dialogue Generation Test: SUCCESS!');
    } catch (error) {
      toast.error(`Dialogue generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlotContinuationTest = async () => {
    setIsLoading(true);
    try {
      const response = await generatePlotContinuation(
        'The heroes have found the ancient map leading to the treasure',
        'A world of magic and adventure',
        ['Sir Galahad', 'Merlin', 'Lady Guinevere']
      );
      setTestResults(prev => ({ ...prev, plotContinuation: response }));
      toast.success('Plot Continuation Test: SUCCESS!');
    } catch (error) {
      toast.error(`Plot continuation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    try {
      // Run all tests sequentially
      await handleConnectionTest();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
      await handleTextGenerationTest();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await handleSceneSuggestionTest();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await handleDialogueTest();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await handlePlotContinuationTest();
      
      toast.success('All AI tests completed!');
    } catch (error) {
      toast.error('Some tests failed. Check individual results.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 mb-8">
          <h1 className="text-3xl font-bold gradient-text-cosmic mb-4">
            🤖 AI Integration Test Suite
          </h1>
          <p className="text-gray-300 mb-6">
            Test the Google Gemini AI integration to ensure all features are working correctly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <button
              onClick={handleConnectionTest}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              🔗 Test Connection
            </button>
            
            <button
              onClick={handleTextGenerationTest}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              📝 Test Text Generation
            </button>
            
            <button
              onClick={handleSceneSuggestionTest}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              🎬 Test Scene Suggestions
            </button>
            
            <button
              onClick={handleDialogueTest}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              💬 Test Dialogue Generation
            </button>
            
            <button
              onClick={handlePlotContinuationTest}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              📖 Test Plot Continuation
            </button>
            
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 col-span-full md:col-span-1 lg:col-span-1"
            >
              🚀 Run All Tests
            </button>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-gray-300 mt-2">Testing AI integration...</p>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          {/* Connection Test Result */}
          {testResults.connection && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🔗 Connection Test Result
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  testResults.connection.success 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {testResults.connection.success ? 'SUCCESS' : 'FAILED'}
                </span>
              </h3>
              <p className="text-gray-300 mb-2">{testResults.connection.message}</p>
              {testResults.connection.response && (
                <div className="bg-gray-800/50 p-3 rounded">
                  <p className="text-green-300 font-mono">{testResults.connection.response}</p>
                </div>
              )}
            </div>
          )}

          {/* Text Generation Result */}
          {testResults.textGeneration && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                📝 Text Generation Result
                <span className="ml-2 px-2 py-1 rounded text-sm bg-green-500/20 text-green-300">
                  SUCCESS
                </span>
              </h3>
              <div className="bg-gray-800/50 p-3 rounded">
                <p className="text-gray-300">{testResults.textGeneration}</p>
              </div>
            </div>
          )}

          {/* Scene Suggestion Result */}
          {testResults.sceneSuggestion && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🎬 Scene Suggestion Result
                <span className="ml-2 px-2 py-1 rounded text-sm bg-green-500/20 text-green-300">
                  SUCCESS
                </span>
              </h3>
              <div className="bg-gray-800/50 p-3 rounded">
                <p className="text-gray-300 whitespace-pre-line">{testResults.sceneSuggestion}</p>
              </div>
            </div>
          )}

          {/* Dialogue Result */}
          {testResults.dialogue && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                💬 Dialogue Generation Result
                <span className="ml-2 px-2 py-1 rounded text-sm bg-green-500/20 text-green-300">
                  SUCCESS
                </span>
              </h3>
              <div className="bg-gray-800/50 p-3 rounded">
                <p className="text-gray-300">{testResults.dialogue}</p>
              </div>
            </div>
          )}

          {/* Plot Continuation Result */}
          {testResults.plotContinuation && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                📖 Plot Continuation Result
                <span className="ml-2 px-2 py-1 rounded text-sm bg-green-500/20 text-green-300">
                  SUCCESS
                </span>
              </h3>
              <div className="bg-gray-800/50 p-3 rounded">
                <p className="text-gray-300 whitespace-pre-line">{testResults.plotContinuation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Environment Check */}
        <div className="glass-card p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">🔧 Environment Check</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="font-semibold">GEMINI_API_KEY:</span> {
                import.meta.env.VITE_GEMINI_API_KEY 
                  ? '✅ Set' 
                  : '❌ Not found'
              }
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Package:</span> @google/genai ✅ Installed
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Environment:</span> {import.meta.env.MODE}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITest; 