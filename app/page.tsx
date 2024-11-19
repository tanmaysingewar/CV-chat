'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Component1Icon, PersonIcon, PaperPlaneIcon, DashboardIcon } from "@radix-ui/react-icons"
import { useState, useRef, useEffect } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  // State for messages
  const [messages, setMessages] = useState<{ 
    message: string; 
    sender: string;
    responseDetails?: {
      cit: number;
      drt: number;
      rgt: number;
      networkLatency: number;
      totalResponseTime: number;
    }
  }[]>([])

  // Ref for scroll area
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // State for bot typing
  const [isBotTyping, setIsBotTyping] = useState(false)

  // State for Personality and LLM selection
  const [personality, setPersonality] = useState("delhi")
  const [llmModel, setLlmModel] = useState("llama-3.1-70b-versatile")

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isBotTyping])

  const handleSubmit = async (message: string) => {
    if (message.trim()) {
      const userMessage = { message, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
  
      const startTime = Date.now();
      setIsBotTyping(true);
  
      try {
        const response = await fetch("https://summaryapi.iamtanmay.in/cv/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            question: message,
            llm: llmModel,
            personality: personality
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch response from the server");
        }
  
        const data = await response.json();
  
        const endTime = Date.now();
        const totalTime = endTime - startTime; // milliseconds
        const cit = data.cit || 0;
        const drt = data.drt || 0;
        const rgt = data.rgt || 0;
        const networkLatency = totalTime - (data.cit + data.drt + data.rgt); // milliseconds
  
        setMessages((prev) => [
          ...prev,
          { 
            message: data.response || "Sorry, I didn't understand that.", 
            sender: "bot", 
            responseDetails: {
              cit,
              drt,
              rgt,
              networkLatency,
              totalResponseTime: cit + drt + rgt + networkLatency
            }
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { 
            message: "There was an error fetching the response. Please try again.", 
            sender: "bot" 
          },
        ]);
        console.log(error);
      } finally {
        setIsBotTyping(false);
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SidebarNav 
          personality={personality}
          setPersonality={setPersonality}
          llmModel={llmModel}
          setLlmModel={setLlmModel}
        />
        <SidebarInset className="flex flex-col">
          <div className="flex flex-col justify-between m-auto w-full h-screen">
            <header className="flex h-14 flex-row items-center border-b p-2">
              <SidebarTrigger className="h-8 w-8" />
              <p className="h-8 text-center mt-[10px] font-bold ml-4">CV Playground</p>
            </header>
            <ScrollArea 
              ref={scrollAreaRef} 
              className="max-w-2xl w-full m-auto h-full p-2 md:p-1 overflow-y-auto"
            >
              {messages.map((message, index) => (
                <div key={index} className="w-full">
                  {message.sender === "user" ? (
                    <div className="px-4 py-2 bg-green-100 rounded mt-2 pt-3 w-full mx-auto">
                      <div className="flex flex-row items-center">
                        <PersonIcon className="mr-1 h-3 w-3" />
                        <p className="text-xs text-gray-700 font-bold">You</p>
                      </div>
                      <p className="text-sm mt-1">{message.message}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="pt-2 bg-gray-200 rounded mt-2 mx-auto p-1">
                        <div className="flex flex-row items-center px-2">
                          <Component1Icon className="mr-1 h-3 w-3" />
                          <p className="text-xs text-gray-700 font-bold">Delhi Bot</p>
                        </div>
                        <p className="text-sm mt-1 px-2">{message.message}</p>
                        {message.responseDetails && (
                          <div className="mt-2 bg-gray-100 p-2 rounded">
                            <p className="text-sm font-bold text-gray-700">Response Times:</p>
                            <table className="table-auto mt-1 text-gray-700 text-xs font-normal">
                              <tbody>
                                <tr>
                                  <td className="font-normal">Category Identification Time:</td>
                                  {
                                    message.responseDetails.cit > 1000 ?
                                    <td className="px-2 text-red-400">{message.responseDetails.cit.toFixed(2)} ms</td> : 
                                    <td className="px-2 text-green-700">{message.responseDetails.cit.toFixed(2)} ms</td>
                                  }
                                </tr>
                                <tr>
                                  <td>Data Retrieval Time:</td>
                                  {
                                    message.responseDetails.drt > 1000 ?
                                    <td className="px-2 text-red-400">{message.responseDetails.drt.toFixed(2)} ms</td> : 
                                    <td className="px-2 text-green-700">{message.responseDetails.drt.toFixed(2)} ms</td>
                                  }
                                </tr>
                                <tr>
                                  <td className="">Response Generation Time:</td>
                                  {
                                    message.responseDetails.rgt > 1000 ?
                                    <td className="px-2 text-red-400">{message.responseDetails.rgt.toFixed(2)} ms</td> : 
                                    <td className="px-2 text-green-700">{message.responseDetails.rgt.toFixed(2)} ms</td>
                                  }
                                </tr>
                                <tr>
                                  <td className="pb-2">Network Latency:</td>
                                  {
                                    message.responseDetails.networkLatency > 1000 ?
                                    <td className="px-2 pb-2 text-red-400">{message.responseDetails.networkLatency.toFixed(2)} ms</td> : 
                                    <td className="px-2 pb-2 text-green-700">{message.responseDetails.networkLatency.toFixed(2)} ms</td>
                                  }
                                </tr>
                                <tr className="border-t font-bold">
                                  <td className="pt-2">Total Response Time:</td>
                                  <td className="px-2">{message.responseDetails.totalResponseTime.toFixed(2)} ms | {(message.responseDetails.totalResponseTime / 1000).toFixed(2)} sec</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isBotTyping && (
                <div className="px-4 py-2 max-w-2xl bg-gray-100 rounded mt-2 mx-auto flex flex-col">
                  <div className="flex flex-row items-center">
                    <Component1Icon className="mr-1 h-3 w-3" />
                    <p className="text-xs text-gray-700 font-bold">Delhi Bot</p>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full"></span>
                    <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full delay-200"></span>
                    <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full delay-400"></span>
                  </div>
                </div>
              )}
            </ScrollArea>
            <MessageInput onSubmit={handleSubmit} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}


function MessageInput({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("")

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(message)
    setMessage("")
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-row w-full max-w-2xl justify-center m-auto md:pb-5 pb-2 p-2">
      <Input
        className="mr-2 flex-grow"
        placeholder="Enter your message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <Button type="submit"><PaperPlaneIcon className="mr-1 h-3 w-3" /></Button>
    </form>
  )
}

function SidebarNav({ 
  personality, 
  setPersonality, 
  llmModel, 
  setLlmModel 
}: { 
  personality: string, 
  setPersonality: (value: string) => void,
  llmModel: string,
  setLlmModel: (value: string) => void
}) {
  return (
    <Sidebar className="">
      <div className="m-2">
        <p className="text-lg font-semibold">Culture VO AI</p>
        <p className="text-xs text-gray-700 ">
          Select the Personality and the LLM you want
        </p>
      </div>
      <SidebarContent className="mt-3 p-2">
        <p className="text-sm font-semibold">Select the Personality</p>
        <Select 
          value={personality}
          onValueChange={(value) => setPersonality(value)}
        >
          <SelectTrigger className="outline-none w-full">
            <SelectValue placeholder="Select a Personality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="jaipur"disabled>Jaipur</SelectItem>
            <SelectItem value="mumbai" disabled>Mumbai</SelectItem>
            <SelectItem value="pune" disabled>Pune</SelectItem>
            <SelectItem value="kolkata" disabled>Kolkata</SelectItem>
            <SelectItem value="chennai" disabled>Chennai</SelectItem>
            <SelectItem value="hyderabad" disabled>Hyderabad</SelectItem>
            <SelectItem value="bangalore" disabled>Bangalore</SelectItem>
            {/* Add more personalities as needed */}
          </SelectContent>
        </Select>
        <p className="text-sm font-semibold">Select the LLM Model</p>
        <Select 
          value={llmModel}
          onValueChange={(value) => setLlmModel(value)}
        >
          <SelectTrigger className="outline-none w-full">
            <SelectValue placeholder="Select a Personality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="llama-3.2-1b-preview" disabled>Llama 3.2 1B Preview</SelectItem>
            <SelectItem value="llama-3.2-3b-preview" disabled>Llama 3.2 3B Preview</SelectItem>
            <SelectItem value="llama-3.1-70b-versatile">

              <div className="flex flex-row items-center">
              <p>Llama 3.1 70B Versatile</p> <p className="text-green-500 text-xs ml-5">Preferred</p>
              </div>
            </SelectItem>
            <SelectItem value="llama-3.1-70b-specdec" disabled>Llama 3.1 70B Specdec</SelectItem>
            <SelectItem value="llama-3.1-8b-instant" disabled>Llama 3.1 8B Instant</SelectItem>
            <SelectItem value="llama3-70b-8192" disabled>Llama 3 70B</SelectItem>
            <SelectItem value="llama3-8b-8192" disabled>Llama 3 8B</SelectItem>
            <SelectItem value="mixtral-8x7b-32768" disabled>Mixtral 8x7B</SelectItem>
            <SelectItem value="gemma2-9b-it" disabled>Gemma 2 9B</SelectItem>
            <SelectItem value="gemma-7b-it" disabled>Gemma 7B</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-3">
          <p className="font-semibold mb-1">Scale Descriptions</p>
          <div className="mb-2">
            <p className="text-gray-700 text-xs font-bold">Category Identification Time:</p>
            <p className="text-gray-700 text-xs ">Time Taken to Identify the relative Category using Llama 3.1 70B Specdec</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-700 text-xs font-bold">Data Retrieval Time:</p>
            <p className="text-gray-700 text-xs ">Time Taken to Retrieve the Data from Redis Cache from the third party service - <span className=" underline "> Upstash</span> </p>
          </div>
          <div className="mb-2">
            <p className="text-gray-700 text-xs font-bold">Response Generation Time:</p>
            <p className="text-gray-700 text-xs ">Time Taken to Generate the Response from selected LLM Model by using Persona of the Bot and Relative Data</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-700 text-xs font-bold">Network Latency:</p>
            <p className="text-gray-700 text-xs ">Latency between the client and the server communicating with the API</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-700 text-xs font-bold">Server Response Time:</p>
            <p className="text-gray-700 text-xs ">Time Taken to Server took to process the request</p>
          </div>
        </div>
        <div className="bg-gray-200 p-2 mt-2 rounded">
          <p className="text-gray-700 text-xs font-bold mb-1">Note:</p>
          <p className="text-gray-700 text-xs "><span className="text-red-400 underline">Red</span> Colored Texts shows the latency is beyond 1000 ms and <span className="text-green-700 underline">Green</span> Colored Texts shows the latency is below 1000 ms</p>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}