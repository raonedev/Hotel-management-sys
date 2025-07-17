import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown"; // For rendering markdown in AI responses

// Utility function to interact with the Gemini API
// This function is defined directly within the immersive for self-containment.
// In a real application, you might keep this in a separate file like `utils/gemini.js`.
const askGemini = async (userMessage, exerciseName) => {
  // API_KEY should be an empty string in the Canvas environment.
  // Canvas will automatically provide the API key at runtime for allowed models.
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // System prompt to guide the AI's behavior
  const SYSTEM_PROMPT = "You are a fun, interactive, playful, and concise AI. Keep responses short, engaging, and to the point. Also use emoji and only give replies related to health; other topics are strictly prohibited.";

  // Construct the chat history for the API request
  // The system prompt is included as the first user message to guide the model's initial behavior.
  const chatHistory = [
    { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\nExercise Name: ${exerciseName}` }] },
    { role: "user", parts: [{ text: userMessage }] }
  ];

  const payload = {
    contents: chatHistory,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Safely access the AI's response from the nested structure
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const aiResponse = result.candidates[0].content.parts[0].text;
      return aiResponse;
    } else {
      console.error("Gemini API response structure unexpected:", result);
      return "Sorry, I couldn't get a clear response.";
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return "Sorry, something went wrong while connecting to the AI.";
  }
};


const AIChat = ({ exerciseName = "General Health" }) => { // Default prop for exerciseName
  const [userInput, setUserInput] = useState(""); // State for user's input message
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [isTyping, setIsTyping] = useState(false); // State to indicate if AI is typing
  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

  // Effect to scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message to the AI
  const handleSendMessage = async () => {
    if (!userInput.trim()) return; // Prevent sending empty messages

    const newUserMessage = { text: userInput, sender: "You" };
    // Add user's message to the chat history
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput(""); // Clear the input field
    setIsTyping(true); // Show typing indicator

    try {
      // Call the Gemini API utility
      const aiReply = await askGemini(userInput, exerciseName);
      // Add AI's response to the chat history
      setMessages((prevMessages) => [...prevMessages, { text: aiReply, sender: "AI" }]);
    } catch (error) {
      // Handle errors during AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error: Failed to get AI response.", sender: "AI" },
      ]);
      console.error("Error sending message to AI:", error);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  // Handle key press for sending message on Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new line
      e.preventDefault(); // Prevent default Enter behavior (e.g., new line in textarea)
      handleSendMessage();
    }
  };

  return (
    // Main container for the chat interface, with dark background and rounded corners
    // Added max-w-4xl and mx-auto for horizontal margin on desktop
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-inter p-4 sm:p-6 rounded-2xl shadow-xl lg:max-w-4xl lg:mx-auto">
      {/* Header */}
      <div className="text-center mb-6 py-3 bg-gray-800 rounded-xl shadow-md">
        {/* Updated title for hotel booking bot */}
        <h1 className="text-3xl font-extrabold text-white">
          🏨 Hotel Booking Assistant
        </h1>
        {/* Updated description for hotel booking bot */}
        <p className="text-gray-400 text-sm mt-1">
          How can I assist you with your hotel reservation today?
        </p>
      </div>

      {/* Messages display area */}
      <div className="flex-grow overflow-y-auto pr-2 mb-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 italic mt-10">
            Start a conversation by typing a message below!
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-xl shadow-md ${
                msg.sender === "You"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" // User message gradient
                  : "bg-gray-700 text-gray-100" // AI message background
              }`}
            >
              <p className="font-semibold mb-1 text-sm text-left">
                {msg.sender === "You" ? "You" : "AI"}
              </p>
              <div className="text-sm break-words whitespace-pre-wrap text-left">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[75%] p-3 rounded-xl shadow-md bg-gray-700 text-gray-100">
              <p className="font-semibold mb-1 text-sm">AI</p>
              <div className="flex items-center">
                {/* Simple loading spinner */}
                <svg className="animate-spin h-4 w-4 mr-2 text-blue-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm">Typing...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Input area */}
      <div className="flex gap-3 mt-4">
        <textarea
          className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200
                     resize-none h-12 overflow-hidden" // Fixed height, no manual resize
          placeholder="Type your message here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1} // Start with one row
          style={{ minHeight: '48px', maxHeight: '120px' }} // Min and max height for textarea
        />
        <button
          onClick={handleSendMessage}
          className="px-6 py-3 rounded-lg text-white font-semibold flex-shrink-0
                     bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg
                     hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                     transform hover:-translate-y-0.5"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
