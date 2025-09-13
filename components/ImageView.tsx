import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageIcon, SparklesIcon, DownloadIcon } from './icons/Icons';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      console.error('Image generation error:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-gray-900">
      <div className="w-full max-w-2xl text-center">
        <div className="flex flex-col gap-4 mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe the image you want to create... e.g., 'a cyberpunk cityscape at sunset'"
            className="w-full p-4 text-lg text-white bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
                <>
                <SparklesIcon className="w-6 h-6"/>
                <span>Generate Image</span>
                </>
            )}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="text-center text-gray-400">
              <SparklesIcon className="w-16 h-16 mx-auto animate-pulse text-blue-500" />
              <p className="mt-2 text-lg">Your creation is loading...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={prompt} className="object-contain w-full h-full" />
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon className="w-24 h-24 mx-auto" />
              <p className="mt-2 text-xl">Your generated image will appear here</p>
            </div>
          )}
        </div>
        {imageUrl && !isLoading && (
            <a
                href={imageUrl}
                download="sidxnt-ai-generated-image.png"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 mt-4 text-lg font-semibold text-white bg-gray-600 rounded-xl hover:bg-gray-500 transition-colors"
                aria-label="Download generated image"
            >
                <DownloadIcon className="w-6 h-6" />
                <span>Download Image</span>
            </a>
        )}
      </div>
    </div>
  );
};

export default ImageView;