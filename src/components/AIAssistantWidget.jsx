/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";

const AIAssistantWidget = ({ memeDetails = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Dummy chat history with useState to allow updates
  const [chatHistory, setChatHistory] = useState([
    {
      type: "assistant",
      content:
        "Hello! I'm RealmsAI. How can I help you with meme insight today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

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
        `🎨 Help me create a meme`,
        `💎 NFT valuation insights`,
      ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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

  // Simulated AI response generator
  const generateAIResponse = (userMessage) => {
    const responses = [
      "Based on current trends, your meme has great potential! The format is particularly popular with crypto enthusiasts. Would you like specific improvement suggestions?",
      "I've analyzed similar successful memes. Your concept is unique, but we could enhance its viral potential. Want to see some examples?",
      "Great idea! This type of meme typically performs well on Twitter and Reddit. Shall we optimize it for these platforms?",
      "The meme's structure is solid! Consider adding more trending elements to increase engagement. Would you like some suggestions?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");

    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        type: "assistant",
        content: generateAIResponse(message),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      type: "user",
      content: suggestion,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatHistory((prev) => [...prev, userMessage]);

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        type: "assistant",
        content: generateAIResponse(suggestion),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftOrder) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed w-fit bottom-4 right-4 z-50">
      {isOpen && (
        <div
          ref={AIref}
          className="bg-[#242424] border border-blue-500 rounded-lg lg:w-[400px] mb-4 overflow-hidden shadow-lg"
        >
          <div className="flex justify-between items-center p-4 border-b border-blue-500">
            <h3 className="bg-gradient-to-r from-[#4782E0] to-fuchsia-300 bg-clip-text text-transparent font-mono">
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

          <div className="flex p-3 flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-2 bg-blue-900 bg-opacity-20 hover:bg-opacity-50 rounded-lg text-blue-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <div className="h-96 overflow-y-auto p-4 bg-[#242424]">
            <div className="space-y-4 mb-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.type === "user" ? "bg-blue-600" : "bg-gray-600"
                    } rounded-lg p-3`}
                  >
                    <div className="text-sm text-gray-200 whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-blue-500">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask anything about memes..."
                className="flex-1 bg-blue-900 bg-opacity-20 text-blue-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSendMessage}
                className="text-blue-400 hover:text-blue-300"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen ? (
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors">
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
