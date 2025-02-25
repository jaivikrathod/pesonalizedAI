import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../css/chat.css";

const socket = io("http://127.0.0.1:5000"); // Connect to WebSocket server

export default function Chat2() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    socket.on("chat_response", (data) => {
      console.log("Received from server:", data);
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.answer || "I'm sorry, I couldn't process your question.", media: data.media || [] }
      ]);
    });
  
    return () => {
      socket.off("chat_response");
    };
  }, []);
  

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });



  const handleSend = () => {

    console.log(userInput);
    
    if (userInput.trim() === "") return;

    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: userInput }]);
    
    socket.emit("chat_message", { question: userInput });

    setUserInput("");
  };

  const handleInputChange = (e) => setUserInput(e.target.value);
  const handleKeyPress = (e) => e.key === "Enter" && handleSend();

  return (
    <div className="chat-main">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-4 text-center font-bold">
          Chat with Us
        </div>

     <div className="h-96 overflow-y-auto p-4 space-y-4">
  {messages.map((message, index) => (
    <div key={index} className={`flex ${message.sender === "bot" ? "items-start" : "justify-end"}`}>
      {message.sender === "bot" && <div className="w-10 h-10 rounded-full bg-gray-300"></div>}
      <div className={`${message.sender === "bot" ? "bg-gray-100 text-gray-700" : "bg-blue-500 text-white"} p-3 rounded-lg shadow text-sm max-w-xs`}>
        {message.text}
        {/* Render Media if Available */}
        {message.media && message.media.map((mediaUrl, i) => (
          <div key={i} className="mt-2">
            {mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") ? (
              <video src={mediaUrl} controls className="w-40 rounded-md" />
            ) : (
              <img src={mediaUrl} alt="Media" className="w-40 rounded-md" />
            )}
          </div>
        ))}
      </div>
      {message.sender === "user" && <div className="w-10 h-10 rounded-full bg-gray-300"></div>}
    </div>
  ))}
</div>


        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={userInput}
              onChange={handleInputChange}
              onClick={handleKeyPress}
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
