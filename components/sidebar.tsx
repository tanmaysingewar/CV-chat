import { DashboardIcon, Component1Icon, PersonIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
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
import { Badge } from "./ui/badge"

export function SidebarNav() {
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
                <Select defaultValue="delhi">
                    <SelectTrigger className="outline-none w-full">
                        <SelectValue placeholder="Select a Personality" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm font-semibold">Select the LLM Model</p>
                <Select defaultValue="llama-3.1-70b-versatile">
                    <SelectTrigger className="outline-none w-full">
                        <SelectValue placeholder="Select a Personality" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="llama-3.2-1b-preview">Llama 3.2 1B Preview</SelectItem>
                        <SelectItem value="llama-3.2-3b-preview">Llama 3.2 3B Preview</SelectItem>
                        <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B Versatile <Badge variant="outline" className="border-green-200 bg-green-200">Preferred</Badge></SelectItem>
                        <SelectItem value="llama-3.1-70b-specdec">Llama 3.1 70B Specdec</SelectItem>
                        <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B Instant</SelectItem>
                        <SelectItem value="llama3-70b-8192">Llama 3 70B</SelectItem>
                        <SelectItem value="llama3-8b-8192">Llama 3 8B</SelectItem>
                        <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                        <SelectItem value="gemma2-9b-it">Gemma 2 9B</SelectItem>
                        <SelectItem value="gemma-7b-it	">Gemma 7B</SelectItem>
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
                        <p className="text-gray-700 text-xs ">Time Taken to Retrieve the Data from Redis Cache</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-700 text-xs font-bold">Response Generation Time:</p>
                        <p className="text-gray-700 text-xs ">Time Taken to Generate the Response from selected LLM Model by using Persona of the Bot and Relative Data</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-700 text-xs font-bold">Total Response Time:</p>
                        <p className="text-gray-700 text-xs ">Time Taken to Generate the Response</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-700 text-xs font-bold">Server Response Time:</p>
                        <p className="text-gray-700 text-xs ">Time Taken to Server took to process the request</p>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}