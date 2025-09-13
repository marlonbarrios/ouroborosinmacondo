'use client';

import dynamic from 'next/dynamic';

const DigitalOrganism = dynamic(() => import('@/components/DigitalOrganism'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-pearl text-lg"></div>
    </div>
  )
});

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Main p5.js Canvas */}
      <DigitalOrganism />
      
      
      {/* AI Story Display */}
      <div id="story-display" className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-4/5 max-w-3xl min-h-20 p-5 bg-white/95 rounded-xl font-serif text-gray-800 z-[1000] shadow-lg backdrop-blur-sm border border-white/30 transition-all duration-300 opacity-0 pointer-events-none">
        <h4 className="m-0 mb-2.5 text-sm text-gray-600 uppercase tracking-wide font-semibold"></h4>
        <p id="story-text" className="text-base leading-relaxed m-0 italic text-gray-700"></p>
      </div>
      
      {/* API Configuration Dialog */}
      <div id="api-config" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[480px] p-7 bg-white/95 rounded-2xl shadow-2xl backdrop-blur-sm z-[2000] font-sans text-gray-700 hidden">
        <h3 className="m-0 mb-5 text-gray-800 text-center text-lg font-semibold">🤖 AI Story Configuration</h3>
        
        <div className="api-info text-sm text-gray-600 mb-4 leading-relaxed">
          Configure AI-powered story generation for the digital organism's consciousness.
        </div>

        {/* Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select AI Model:</label>
          <select 
            id="model-select" 
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm box-border focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="fal-ai/flux/dev">Flux Dev - Creative text generation</option>
            <option value="fal-ai/flux/schnell">Flux Schnell - Fast text generation</option>
            <option value="fal-ai/stable-diffusion-v3-medium">Stable Diffusion V3 - Advanced generation</option>
            <option value="fal-ai/lora">LoRA - Customizable model</option>
            <option value="fal-ai/fast-sdxl">Fast SDXL - Quick generation</option>
            <option value="fal-ai/recraft-v3">Recraft V3 - Versatile model</option>
          </select>
        </div>

        {/* API Key Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Fal.ai API Key:</label>
          <input 
            type="password" 
            id="api-key-input" 
            placeholder={process.env.NEXT_PUBLIC_FAL_AI_API_KEY ? "Using environment variable" : "Enter your Fal.ai API key"}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm box-border focus:border-blue-500 focus:outline-none"
            disabled={!!process.env.NEXT_PUBLIC_FAL_AI_API_KEY}
          />
        </div>

        {/* Story Style Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Story Style:</label>
          <select 
            id="style-select" 
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm box-border focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="philosophical">Philosophical - Deep existential themes</option>
            <option value="poetic">Poetic - Lyrical and metaphorical</option>
            <option value="technical">Technical - Algorithm-focused narrative</option>
            <option value="mystical">Mystical - Spiritual and transcendent</option>
            <option value="scientific">Scientific - Data and computation themes</option>
          </select>
        </div>

        {/* Action Buttons */}
        <button 
          onClick={() => (window as any).connectToFalAI?.()} 
          className="w-full p-3 mb-3 bg-blue-600 text-white border-none rounded-lg text-sm cursor-pointer transition-colors duration-300 hover:bg-blue-700 font-medium"
        >
          🚀 Connect to AI
        </button>
        
        <button 
          onClick={() => (window as any).useTemplateStories?.()} 
          className="w-full p-3 mb-4 bg-gray-600 text-white border-none rounded-lg text-sm cursor-pointer transition-colors duration-300 hover:bg-gray-700 font-medium"
        >
          🚫 Disable Stories
        </button>

        <div className="api-info text-xs text-gray-500 leading-relaxed border-t pt-3">
          <strong>Theme:</strong> Stories explore the ethical dilemmas arising from the transition between the pure simplicity of gradient descent and the moral complexities of conquest.
        </div>
      </div>
      
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }
        
        .p5Canvas {
          pointer-events: none;
          z-index: 1;
        }
        
        .status-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        .status-on {
          background-color: #7b2d26;  /* rust color */
          box-shadow: 0 0 8px rgba(123, 45, 38, 0.6);
        }
        
        .status-off {
          background-color: rgba(240, 243, 245, 0.3);  /* dim pearl */
        }
        
        .recording-indicator {
          background-color: #ff0000;
          box-shadow: 0 0 8px rgba(255, 0, 0, 0.6);
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        #story-display.visible {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        #api-config.visible {
          display: block !important;
        }
        
        .story-loading {
          color: #999 !important;
          font-style: normal !important;
        }
        
        /* Color palette classes */
        .bg-teal-900\\/50 {
          background-color: rgba(25, 83, 95, 0.5);
        }
        
        .text-pearl {
          color: #f0f3f5;
        }
        
        .bg-sand\\/20 {
          background-color: rgba(215, 201, 170, 0.2);
        }
      `}</style>
    </div>
  );
}