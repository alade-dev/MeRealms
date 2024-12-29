/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";

const AIAssistantWidget = ({ memeDetails = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const suggestions = memeDetails
    ? [
        `🎨 Analyze this meme's potential`,
        `📈 Show similar trending memes`,
        `💡 Suggest improvements`,
        `🎯 Target audience insights`,
      ]
    : [
        `🔥 Generate my top meme stats`,
        `📊 Market trend analysis`,
        `💎 NFT valuation insights`,
      ];

  const AIref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (AIref.current && !AIref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-10 right-4 z-50">
      {/* Main Chat Window */}
      {isOpen && (
        <div
          ref={AIref}
          className="bg-black border border-blue-500 rounded-lg w-[400px] mb-4 overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-blue-500">
            <h3 className="bg-gradient-to-bl from-blue-500 to-fuchsia-300 bg-clip-text text-transparent font-mono">
              Meet RealmsAI
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-400 hover:text-blue-300"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="h-96 overflow-y-auto p-4 bg-black">
            <div className="text-blue-400 font-mono mb-4">
              {memeDetails
                ? "I'm here to help analyze this meme!"
                : "Your AI companion for meme insights"}
            </div>

            {/* Suggestion Buttons */}
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="text-left p-2 bg-blue-900 bg-opacity-20 hover:bg-opacity-30 rounded-lg text-blue-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-blue-500">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask anything about memes..."
                className="flex-1 bg-blue-900 bg-opacity-20 text-blue-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="text-blue-400 hover:text-blue-300">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}

      {isOpen ? (
       <button
      
       className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full p-3 shadow-lg transition-colors"
     >
       <MessageSquare size={24} />
     </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-bl font-mono from-[#4782E0] to-fuchsia-600 flex gap-2 text-gray-200/95 rounded-full p-3 shadow-lg transition-colors"
        >
          🎭
          <p> Ask RealmsAI</p>
        </button>
      )}
    </div>
  );
};

export default AIAssistantWidget;
