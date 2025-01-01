/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";

const AIAssistantWidget = ({ memeDetails = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const chatEndRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    {
      type: "assistant",
      content: "Hello! I'm RealmsAI. How can I help you with meme insight today?",
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

  const sendMessageToBackend = async (messageText) => {
    const endpoint = threadId 
      ? `http://localhost:3000/chat/${threadId}`
      : 'http://localhost:3000/chat';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      if (!threadId && data.threadId) {
        setThreadId(data.threadId);
      }

      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
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
    try {
      const response = await sendMessageToBackend(message);
      const aiResponse = {
        type: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error calling agent:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const userMessage = {
      type: "user",
      content: suggestion,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatHistory((prev) => [...prev, userMessage]);

    setIsTyping(true);
    try {
      const response = await sendMessageToBackend(suggestion);
      const aiResponse = {
        type: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error processing suggestion:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed w-fit bottom-4 right-4 z-50">
      {isOpen && (
        <div
          ref={AIref}
          className="bg-[#242424] border border-blue-500 rounded-lg lg:w-[400px] max-w-96 sm:h-fit h-[550px] mb-4 overflow-hidden shadow-lg"
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
