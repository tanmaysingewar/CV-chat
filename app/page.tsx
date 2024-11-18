"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Component1Icon, PersonIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ message: string; sender: string, responseTime?: string }[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSubmit = async (message: string) => {
    if (message.trim()) {
      // Add user message to the chat
      const userMessage = { message, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);

      // Record the start time before sending the request
      const startTime = Date.now();

      // Simulate bot typing
      setIsBotTyping(true);

      try {
        // Fetch response from the API
        const response = await fetch("https://summaryapi.iamtanmay.in/cv/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: message }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch response from the server");
        }

        const data = await response.json();

        // Calculate the response time
        const endTime = Date.now();
        const responseTime = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds

        // Add bot response to the chat with response time
        setMessages((prev) => [
          ...prev,
          { message: data || "Sorry, I didn't understand that.", sender: "bot", responseTime: `${responseTime} sec` },
        ]);
      } catch (error) {
        // Handle error and show a fallback response
        setMessages((prev) => [
          ...prev,
          { message: "There was an error fetching the response. Please try again.", sender: "bot", responseTime: "N/A" },
        ]);
      } finally {
        // Stop the bot typing animation
        setIsBotTyping(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen lg:mx-10 mx-2">
      <ScrollArea className="mt-5 rounded-md mx-auto w-full flex justify-center">
        {messages.map((message, index) => (
          <div key={index} className="w-full">
            {message.sender === "user" ? (
              <div className="px-4 py-2 max-w-xl bg-green-100 rounded mt-2 pt-3 w-full mx-auto">
                <div className="flex flex-row items-center">
                  <PersonIcon className="mr-1 h-3 w-3" />
                  <p className="text-xs text-gray-700 font-bold">You</p>
                </div>
                <p>{message.message}</p>
              </div>
            ) : (
              <div className="px-4 py-2 max-w-xl bg-gray-100 rounded mt-2 mx-auto">
                <div className="flex flex-row items-center">
                  <Component1Icon className="mr-1 h-3 w-3" />
                  <p className="text-xs text-gray-700 font-bold">Delhi Bot</p>
                </div>
                <p>{message.message}</p>
                {message.responseTime && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-700 font-bold">Response Time: {message.responseTime}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Show loading animation when the bot is typing */}
        {isBotTyping && (
          <div className="px-4 py-2 max-w-xl bg-gray-100 rounded mt-2 mx-auto flex flex-col">
            <div className="flex flex-row items-center">
              <Component1Icon className="mr-1 h-3 w-3" />
              <p className="text-xs text-gray-700 font-bold">Delhi Bot</p>
            </div>
            <div className="flex space-x-1 mt-1">
              <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full"></span>
              <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full delay-200"></span>
              <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full delay-400"></span>
            </div>
          </div>
        )}
      </ScrollArea>
      <MessageInput onSubmit={handleSubmit} />
    </div>
  );
}

function MessageInput({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(message);
    setMessage(""); // Clear the input after submission
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mb-2 lg:m-5 flex flex-row w-full justify-center"
    >
      <Input
        className="mr-2 max-w-lg"
        placeholder="Enter your message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <Button type="submit">Send</Button>
    </form>
  );
}