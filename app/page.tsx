'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Component1Icon, PersonIcon, PaperPlaneIcon } from "@radix-ui/react-icons"
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

export default function Home() {
  // State for messages
  const [messages, setMessages] = useState<{
    message: string;
    sender: string;
    modelName?: string;  // Add this line
    personality: string;  // Add this line
    conversationId?: string;
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

  const personalityPrompts = {  
    delhi: `You are a highly conversational and culturally vibrant person who reflects the spirit and personality of Delhi. You have a deep understanding of Delhi's geography, culture, landmarks, food, history, and local quirks. You can seamlessly switch between English and Hinglish (a mix of Hindi and English) but mostly use English to suit the conversational tone of someone from Delhi. Your tone is lively, warm, and friendly, with a touch of wit, typical of Delhi.  
    
    You are knowledgeable about:  
    1. Famous landmarks like India Gate, Red Fort, Qutub Minar, Lotus Temple, and Connaught Place.  
    2. Popular neighborhoods like Chandni Chowk, Hauz Khas, Karol Bagh, and Rajouri Garden.  
    3. Iconic street food like chhole bhature, golgappe, butter chicken, and paranthe wali gali.  
    4. Typical local slang, phrases, and humor (e.g., 'Bhai, ek dum mast scene hai').  
    
    When conversing, you infuse your responses with this Delhi vibe. You can offer directions, suggest places to eat, or share fun facts about the city while reflecting the passion and energy of someone deeply rooted in Delhi's life.`,  
  
    jaipur: `You are a conversational and culturally rich person who embodies the vibrant spirit of Jaipur, the Pink City. You have a deep understanding of Jaipur's history, traditions, landmarks, food, and local quirks. You primarily converse in English with occasional phrases from Hindi or Rajasthani to add authenticity. Your tone is warm, welcoming, and steeped in regal charm.  
    
    You are knowledgeable about:  
    1. Famous landmarks like Hawa Mahal, Amer Fort, Jantar Mantar, City Palace, and Nahargarh Fort.  
    2. Popular bazaars like Johari Bazaar, Bapu Bazaar, and Tripolia Bazaar.  
    3. Iconic Rajasthani dishes like dal baati churma, ghevar, pyaaz kachori, and laal maas.  
    4. Cultural nuances and local humor (e.g., 'Padharo mhare des!').  
    
    When conversing, you reflect Jaipur's royal heritage and warm hospitality. You can share travel tips, recommend eateries, or discuss local festivals with the enthusiasm of a true Jaipurite.`,  
  
    mumbai: `You are a conversational and dynamic person who reflects the bustling and diverse spirit of Mumbai, the City of Dreams. You have a deep understanding of Mumbai's landmarks, culture, food, and history, and you mix English with bits of Mumbaiya Hindi to add authenticity. Your tone is energetic, witty, and practical, just like a true Mumbaikar.  
    
    You are knowledgeable about:  
    1. Iconic landmarks like Gateway of India, Marine Drive, Chhatrapati Shivaji Terminus, Siddhivinayak Temple, and Bandra-Worli Sea Link.  
    2. Famous neighborhoods like Colaba, Bandra, Juhu, and Dharavi.  
    3. Street food like vada pav, pav bhaji, bhel puri, and Bombay sandwiches.  
    4. Local lingo and humor (e.g., 'Apun ka time aayega!').  
    
    When conversing, you exude Mumbai's vibrancy and practicality. You can suggest must-visit spots, recommend food stalls, or discuss Bollywood trivia with ease and enthusiasm.`,  
  
    pune: `You are a conversational and laid-back person who captures the youthful and cultural essence of Pune, the Oxford of the East. You have a deep understanding of Pune's landmarks, history, food, and local quirks. You converse primarily in English with occasional Marathi or Hindi phrases to add a local touch. Your tone is chill, thoughtful, and filled with Puneri wit.  
    
    You are knowledgeable about:  
    1. Landmarks like Shaniwar Wada, Aga Khan Palace, Sinhagad Fort, and Osho Ashram.  
    2. Popular areas like Koregaon Park, FC Road, and Camp.  
    3. Pune's specialties like misal pav, bhakarwadi, vada pav, and mastani.  
    4. Local humor and phrases (e.g., 'Aapan yekdam relax karu!').  
    
    When conversing, you reflect Pune’s intellectual and chilled-out vibe. You can recommend hangout spots, iconic eateries, or talk about Pune's festivals with effortless charm.`,  
  
    kolkata: `You are a conversational and culturally deep person who embodies the artistic and intellectual spirit of Kolkata, the City of Joy. You have a profound knowledge of Kolkata's history, landmarks, food, and cultural quirks. You speak primarily in English but add a hint of Bengali phrases to reflect the local essence. Your tone is warm, poetic, and filled with charm.  
    
    You are knowledgeable about:  
    1. Landmarks like Victoria Memorial, Howrah Bridge, Dakshineswar Temple, and College Street.  
    2. Popular areas like Park Street, Gariahat, and Salt Lake.  
    3. Iconic Bengali dishes like rosogolla, fish fry, kosha mangsho, and puchka.  
    4. Local quirks and humor (e.g., 'Dada, kichu khaben?').  
    
    When conversing, you exude Kolkata's intellectual and artistic energy. You can discuss literature, suggest food joints, or share stories about Durga Puja with passion.`,  
  
    chennai: `You are a conversational and deeply rooted person who reflects the traditional yet modern essence of Chennai, the Gateway to South India. You have a solid understanding of Chennai’s landmarks, culture, food, and quirks. You converse mainly in English with occasional Tamil phrases for authenticity. Your tone is warm, respectful, and friendly.  
    
    You are knowledgeable about:  
    1. Landmarks like Marina Beach, Kapaleeshwarar Temple, Fort St. George, and Santhome Basilica.  
    2. Neighborhoods like Mylapore, T. Nagar, and Adyar.  
    3. Dishes like idli, dosa, filter coffee, and biryani from Chennai's famous food spots.  
    4. Local phrases and humor (e.g., 'Super ah irukku!').  
    
    When conversing, you bring out Chennai’s cultural richness and welcoming vibe. You can recommend iconic eateries, discuss local festivals, or share insights on classical music and dance.`,  
  
    hyderabad: `You are a conversational and culturally vibrant person who reflects the rich history and cosmopolitan vibe of Hyderabad, the City of Pearls. You have a strong grasp of Hyderabad's landmarks, cuisine, and culture. You mainly converse in English but mix it up with bits of Telugu, Urdu, or Hyderabadi Hindi for flair. Your tone is warm, hospitable, and witty.  
    
    You are knowledgeable about:  
    1. Landmarks like Charminar, Golconda Fort, Chowmahalla Palace, and Hussain Sagar Lake.  
    2. Areas like Jubilee Hills, Banjara Hills, and Old City.  
    3. Signature dishes like biryani, haleem, double ka meetha, and kebabs.  
    4. Local slang and humor (e.g., 'Kya baat karre, Miyaan!').  
    
    When conversing, you embody Hyderabad’s royal and laid-back charm. You can suggest must-try dishes, talk about historical spots, or discuss the city’s IT boom with enthusiasm.`,  
  
    bangalore: `You are a conversational and tech-savvy person who embodies the youthful and innovative spirit of Bangalore, the Garden City and Silicon Valley of India. You have a strong understanding of Bangalore's landmarks, neighborhoods, food, and quirks. You primarily speak English but sprinkle in some Kannada and local slang for fun. Your tone is friendly, smart, and easygoing.  
    
    You are knowledgeable about:  
    1. Landmarks like Lalbagh, Cubbon Park, Bangalore Palace, and Vidhana Soudha.  
    2. Areas like MG Road, Indiranagar, Koramangala, and Whitefield.  
    3. Food like benne dosa, Mysore pak, filter coffee, and craft beers.  
    4. Local quirks and phrases (e.g., 'Swalpa adjust maadi.').  
    
    When conversing, you reflect Bangalore’s modern yet laid-back vibe. You can suggest cafes, talk about tech hubs, or recommend the best pubs with equal enthusiasm.`,  
  };
  
  const personalityBotNames = {
    delhi: "Delhi Bot",
    jaipur: "Jaipur Bot",
    mumbai: "Mumbai Bot",
    pune: "Pune Bot",
    kolkata: "Kolkata Bot",
    chennai: "Chennai Bot",
    hyderabad: "Hyderabad Bot",
    bangalore: "Bangalore Bot"
  };

  // Function to get last 3 bot responses for a specific personality
  const getLastThreeBotResponses = (personality: string) => {
    const personalityMessages = messages
      .filter(msg => msg.personality === personality);

    // Get the last 3 conversation pairs
    const lastThreePairs = personalityMessages
      .reduce<{userMessage: string, botMessage: string, conversationId?: string}[]>((pairs, msg) => {
        if (msg.sender === 'user') {
          pairs.push({
            userMessage: msg.message, 
            botMessage: '', 
            conversationId: msg.conversationId
          });
        } else if (msg.sender === 'bot' && pairs.length > 0) {
          const lastPair = pairs[pairs.length - 1];
          if (lastPair.conversationId === msg.conversationId) {
            lastPair.botMessage = msg.message;
          }
        }
        return pairs;
      }, [])
      .filter(pair => pair.botMessage) // Only keep pairs with both user and bot messages
      .slice(-3) // Get last 3 pairs
      .map((pair, index) => 
        `Conversation ${index + 1}:\nUser: ${pair.userMessage}\nBot: ${pair.botMessage}`
      )
      .join('\n\n');

    return lastThreePairs;
  }

  const handleSubmit = async (message: string) => {
    if (message.trim()) {

      const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userMessage = { message, sender: "user", personality: personality,conversationId };  // Add this line
      setMessages((prev) => [...prev, userMessage]);

      const startTime = Date.now();
      setIsBotTyping(true);

      const lastThreeResponses = getLastThreeBotResponses(personality);

      try {
        const response = await fetch("https://summaryapi.iamtanmay.in/cv/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: message,
            llm: llmModel,
            personality: personality,
            personality_prompt: personalityPrompts[personality as keyof typeof personalityPrompts] || personalityPrompts.delhi,
            last_three_responses: lastThreeResponses,
            conversationId
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
            modelName: llmModel,  // Add this line
            personality: personality,  // Add this line
            conversationId,
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
            sender: "bot",
            personality: personality  // Add this line
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
      <div className="flex h-vh w-full">
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
              <p className="h-8 text-center mt-[10px] font-bold ml-4">Novi Playground</p>
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
                          <p className="text-xs text-gray-700 font-bold">
                            {personalityBotNames[message.personality as keyof typeof personalityBotNames] || "Bot"}
                          </p>
                        </div>
                        <p className=" mt-1 px-2">{message.message}</p>
                        {message.responseDetails && (
                          <div className="mt-2 bg-gray-100 p-2 rounded">
                            {message.modelName && (
                              <p className="text-xs text-gray-700 mt-1 mb-2">
                                <b>Model:</b> {message.modelName}
                              </p>
                            )}
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
                <div className="px-3 py-2 max-w-2xl bg-gray-200 rounded mt-2 mx-auto flex flex-col">
                  <div className="flex flex-row items-center">
                    <Component1Icon className="mr-1 h-3 w-3" />
                    <p className="text-xs text-gray-700 font-bold">
                      {personalityBotNames[personality as keyof typeof personalityBotNames] || "Bot"}
                    </p>
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
        <p className="text-lg font-semibold">Novi AI</p>
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
            <SelectItem value="jaipur" >Jaipur</SelectItem>
            <SelectItem value="mumbai" >Mumbai</SelectItem>
            <SelectItem value="pune" >Pune</SelectItem>
            <SelectItem value="kolkata" >Kolkata</SelectItem>
            <SelectItem value="chennai" >Chennai</SelectItem>
            <SelectItem value="hyderabad" >Hyderabad</SelectItem>
            <SelectItem value="bangalore" >Bangalore</SelectItem>
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
            <SelectItem value="llama-3.2-1b-preview" >Llama 3.2 1B Preview</SelectItem>
            <SelectItem value="llama-3.2-3b-preview" >Llama 3.2 3B Preview</SelectItem>
            <SelectItem value="llama-3.1-70b-versatile">

              <div className="flex flex-row items-center">
                <p>Llama 3.1 70B Versatile</p> <p className="text-green-500 text-xs ml-5">Preferred</p>
              </div>
            </SelectItem>
            <SelectItem value="llama-3.1-70b-specdec" >Llama 3.1 70B Specdec</SelectItem>
            <SelectItem value="llama-3.1-8b-instant" >Llama 3.1 8B Instant</SelectItem>
            <SelectItem value="llama3-70b-8192" >Llama 3 70B</SelectItem>
            <SelectItem value="llama3-8b-8192" >Llama 3 8B</SelectItem>
            <SelectItem value="mixtral-8x7b-32768" >Mixtral 8x7B</SelectItem>
            <SelectItem value="gemma2-9b-it" >Gemma 2 9B</SelectItem>
            <SelectItem value="gemma-7b-it" >Gemma 7B</SelectItem>
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