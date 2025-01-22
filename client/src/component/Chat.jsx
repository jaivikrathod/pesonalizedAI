import React, { useState } from "react";
import "../css/chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I assist you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async () => {
    if (userInput.trim() === "") return;

    // Add user's message to the chat
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    // Simulate or fetch a response from the backend
    try {
      const response = await fetch("http://127.0.0.1:5000/chat/chat2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userInput }),
      });

      const data = await response.json();

      // Add bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.answer || "I'm sorry, I couldn't process your question." },
      ]);
    } catch (error) {
      console.error("Error fetching the response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "There was an error processing your request. Please try again later." },
      ]);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-main">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 text-center font-bold">
          Chat with Us
        </div>

        {/* Chat Box */}
        <div className="h-96 overflow-y-auto p-4 space-y-4" id="chat-box">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-${
                message.sender === "bot" ? "start" : "end justify-end"
              } space-x-2`}
            >
              {message.sender === "bot" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300"></div>
              )}
              <div
                className={`$\{
                  message.sender === "bot"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-blue-500 text-white"
                } p-3 rounded-lg shadow text-sm max-w-xs`}
              >
                {message.text}
              </div>
              {message.sender === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
