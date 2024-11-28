'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { useState, useRef, useEffect, useCallback } from "react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  // SheetTrigger,
} from "@/components/ui/sheet"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import { PanelLeftIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useEditablePrompts } from "./useEditablePrompts"

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

  const { updatePrompt, getPrompt } = useEditablePrompts();

  const [email, setEmail] = useState("");
  const [city, setCity] = useState("delhi");
  const [personalityType, setPersonalityType] = useState("friend");
  const [gender, setGender] = useState("male");

  // State for bot typing
  const [isBotTyping, setIsBotTyping] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const typingIndicatorRef = useRef<HTMLDivElement>(null);

  // New state for tracking title clicks
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const titleClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (!scrollAreaRef.current || !shouldAutoScroll) return;

    const scrollElement = scrollAreaRef.current;

    // Prioritize scrolling to typing indicator if present
    if (isBotTyping && typingIndicatorRef.current) {
      typingIndicatorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    // Otherwise scroll to last message
    else if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    // Fallback to scrolling the container
    else {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [shouldAutoScroll, isBotTyping]);

  // Handle scroll events to detect manual scrolling
  useEffect(() => {
    const scrollElement = scrollAreaRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShouldAutoScroll(isNearBottom);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll on new messages, bot typing status change, or when typing indicator appears/disappears
  useEffect(() => {
    // Add a small delay to ensure DOM updates are complete
    setTimeout(() => {
      scrollToBottom();
    }, 10);
  }, [messages, isBotTyping, scrollToBottom]);

  // Force scroll to bottom on initial load
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  const renderMessages = () => {
    return messages.map((message, index) => {
      const isLastMessage = index === messages.length - 1;
      const messageRef = isLastMessage ? lastMessageRef : null;

      return (
        <div key={index} className="w-full" ref={messageRef}>
          {message.sender === "user" ? (
            <>
              <div className="px-3 bg-orange-500 max-w-lg ml-auto w-fit rounded-lg mt-3 p-1">
                <p className="font-medium max-w-lg ml-auto w-fit text-white ">{message.message}</p>
                {/* Show current time like 12:00 PM */}
                <p className="text-[10px] text-right text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</p>
              </div>
            </>
          ) : (
            <div>
              <div className={`rounded-lg mt-3 max-w-[300px] md:max-w-lg mr-auto w-fit bg-gray-300 p-1`}>
                <p className="text font-medium px-3">{message.message}</p>
                <p className="text-[10px] text-right px-4">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</p>
              </div>

            </div>
          )}
          {isBotTyping && isLastMessage && (
            <div className={`px-4 mt-3 max-w-lg mr-auto w-fit h-10`}>
              <div className="flex space-x-1 mt-auto justify-center items-center mx-auto">
                <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full"></span>
                <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full delay-200"></span>
                <span className="dot animate-bounce bg-gray-500 w-2 h-2 rounded-full delay-400"></span>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  // State for Personality and LLM selection
  // const [personality, setPersonality] = useState("delhi")
  // const [llmModel, setLlmModel] = useState("meta-llama/llama-3.1-70b-instruct")


  // Dynamic prompt selection
  const selectDynamicPrompt = () => {
    const promptKey = `${city}_${personalityType}_${gender}`;
    return getPrompt(promptKey);
  };

  const handleTitleClick = () => {
    // Clear previous timer if exists
    if (titleClickTimerRef.current) {
      clearTimeout(titleClickTimerRef.current);
    }

    // Increment click count
    setTitleClickCount(prev => prev + 1);

    // Set a timer to reset click count after 500ms
    titleClickTimerRef.current = setTimeout(() => {
      setTitleClickCount(0);
    }, 500);

    // Check if clicked 3 times
    if (titleClickCount + 1 === 3) {
      setIsSidebarOpen(true);
      setTitleClickCount(0);
    }
  };

  // const personalityBotNames = {
  //   delhi: "Delhi Bot",
  //   jaipur: "Jaipur Bot",
  //   mumbai: "Mumbai Bot",
  //   pune: "Pune Bot",
  //   kolkata: "Kolkata Bot",
  //   chennai: "Chennai Bot",
  //   hyderabad: "Hyderabad Bot",
  //   bangalore: "Bangalore Bot"
  // };

  const getLastThreeBotResponses = (city: string, personalityType: string, gender: string) => {
    const personalityMessages = messages
      .filter(msg => {
        const matchingPersonality = msg.personality.includes(city) &&
          msg.personality.includes(personalityType) &&
          msg.personality.includes(gender);
        return matchingPersonality;
      });

    // Same logic as before to get last three conversation pairs
    const lastThreePairs = personalityMessages
      .reduce<{ userMessage: string, botMessage: string, conversationId?: string }[]>((pairs, msg) => {
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
      .filter(pair => pair.botMessage)
      .slice(-3)
      .map((pair, index) =>
        `Conversation ${index + 1}:\nUser: ${pair.userMessage}\nBot: ${pair.botMessage}`
      )
      .join('\n\n');

    return lastThreePairs;
  }

  const handleSubmit = async (message: string) => {
    if (message.trim()) {
      if (messages.length === 0 && !email.trim()) {
        alert("Please enter your email before starting the chat");
        return;
      }

      const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fullPersonality = `${city}_${personalityType}_${gender}`;
      const userMessage = {
        message,
        sender: "user",
        personality: fullPersonality,
        conversationId
      };
      setMessages((prev) => [...prev, userMessage]);

      const startTime = Date.now();
      setIsBotTyping(true);
      scrollToBottom();

      const lastThreeResponses = getLastThreeBotResponses(city, personalityType, gender);

      try {
        const response = await fetch("https://summaryapi.iamtanmay.in/cv/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: message,
            llm: "meta-llama/llama-3.1-70b-instruct",
            personality: fullPersonality,
            personality_prompt: selectDynamicPrompt(),
            last_three_responses: lastThreeResponses,
            conversationId,
            // email: email  // Include email in the request
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
            modelName: "meta-llama/llama-3.1-70b-instruct",  // Add this line
            personality: fullPersonality,  // Add this line
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
            personality: fullPersonality  // Add this line
          },
        ]);
        console.log(error);
      } finally {
        setIsBotTyping(false);
      }

    }
  };

  const newChat = () => {
    setMessages([]);
    setCity("delhi");
    setPersonalityType("friend");
    setGender("male");
    setEmail("");
  }

  // Handler for prompt editing
  const handlePromptEdit = (value: string) => {
    const promptKey = `${city}_${personalityType}_${gender}`;
    updatePrompt(promptKey, value);
  };

  return (
    <div className="flex flex-col w-full h-dvh">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side={"left"} className="min-w-full p-2">
          <SheetHeader>
            <SheetTitle className="text-center">Edit Prompt</SheetTitle>
          </SheetHeader>
          <div className="mt-2 flex flex-row items-center justify-end">
            <div className="flex flex-row items-center justify-center mb-2 space-x-2">
              <Select
                value={city}
                onValueChange={(value) => setCity(value)}
              >
                <SelectTrigger className="outline-none max-w-sm w-36">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="Kigali">Kigali</SelectItem>
                  <SelectItem value="tashkent">Tashkent</SelectItem>
                  <SelectItem value="buenos_aires">Buenos Aires</SelectItem>
                  <SelectItem value="kuala_lumpur">Kuala Lumpur</SelectItem>
                </SelectContent>
              </Select>

              {/* Personality Type Selection */}
              <Select
                value={personalityType}
                onValueChange={(value) => setPersonalityType(value)}
              >
                <SelectTrigger className="outline-none max-w-sm w-36">
                  <SelectValue placeholder="Personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                </SelectContent>
              </Select>

              {/* Gender Selection */}
              <Select
                value={gender}
                onValueChange={(value) => setGender(value)}
              >
                <SelectTrigger className="outline-none max-w-sm w-36">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Textarea
              placeholder="Enter your custom prompt"
              className="h-[300px]"
              value={selectDynamicPrompt()}
              onChange={(e) => handlePromptEdit(e.target.value)}
            />
            <p className="text-sm mt-2 font-bold text-red-500">
              Note: Your edited prompt will notbe saved it will active only for this session.If you reload the page, your changes will be lost.
            </p>
          </div>
        </SheetContent>
        <header className="h-14 flex flex-row items-center border-b bg-white p-2 justify-between md:justify-between" >
          <div className="flex-row items-center flex">
            {/* <SheetTrigger>
              <PanelLeftIcon className="h-6 w-6" />
            </SheetTrigger> */}
            <p className="text-center font-bold text-lg ml-2 hidden md:block" onClick={handleTitleClick}>Novi Playground</p>
          </div>
          {/* Make first letter capital */}
          {messages.length != 0 && <p className="h-8 text-center mt-[9px] md:mt-[6px] font-bold mb-1 md:mb-0 text-lg ">{city.charAt(0).toUpperCase() + city.slice(1)} Bot</p>}
          {messages.length != 0 &&
            <Button className="" onClick={() => newChat()}>
              <p>New Chat</p>
            </Button>}
        </header>
        <ScrollArea
          className="flex-1 max-w-2xl w-full mx-auto px-2 md:mb-0"
          ref={scrollAreaRef}
        >
          {messages.length === 0 ? (
            <div className="text-center flex flex-col items-center h-[70vh] space-y-4 mx-auto ">
              <div className="my-auto">
                <h2 className="text-2xl font-bold text-gray-800">Welcome to Novi AI Chat!</h2>
                <p className="text-gray-600 mt-5">Enter your email to get started</p>
                <Input className="mt-4 max-w-64 mx-auto" placeholder="Enter your email" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                <p className="text-gray-600 mt-5">Choose your Novi’s City, Personality and Gender</p>
                <div className="flex flex-row items-center justify-center">
                  <div>
                    <p className="text-gray-600 mt-5 text-left text-sm">Select City</p>
                    <Select
                      value={city}
                      onValueChange={(value) => setCity(value)}
                    >
                      <SelectTrigger className="outline-none max-w-sm m-auto w-36 mt-1 min-w-0">
                        <SelectValue placeholder="Select a Personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="Kigali">Kigali</SelectItem>
                        <SelectItem value="tashkent">Tashkent</SelectItem>
                        <SelectItem value="buenos_aires">Buenos Aires</SelectItem>
                        <SelectItem value="kuala_lumpur">Kuala Lumpur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="ml-2">
                    <p className="text-gray-600 mt-5 text-left text-sm">Select Personality</p>
                    <Select
                      value={personalityType}
                      onValueChange={(value) => setPersonalityType(value)}
                    >
                      <SelectTrigger className="outline-none max-w-sm m-auto w-36 mt-1">
                        <SelectValue placeholder="Select a Personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                        <SelectItem value="romantic">Romantic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                </div>
                <div className="mt-4 rounded-lg max-w-48 mx-auto">
                  <p className="text-gray-600 mt-5 text-center text-sm">Select Gender</p>
                  <Select
                    value={gender}
                    onValueChange={(value) => setGender(value)}
                  >
                    <SelectTrigger className="outline-none max-w-sm m-auto w-36 mt-1">
                      <SelectValue placeholder="Select a Personality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    Start a conversation by typing your message. <br />
                  </p>
                </div>
              </div>
            </div>
          ) :
            <>
              {renderMessages()}
            </>
          }
        </ScrollArea>
        <div className="">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl px-2 py-3 mx-auto flex items-center" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              <MessageInput onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );

}


function MessageInput({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("")

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(message)
    setMessage("")
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-row w-full justify-center">
      <Input
        className="mr-2 flex-grow h-10"
        placeholder="Enter your message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <Button type="submit" className="h-10">
        <PaperPlaneIcon className="mr-1 h-3 w-3" />
      </Button>
    </form>
  )
}

