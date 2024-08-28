'use client'

import Image from "next/image";
import Messages from "@/components/Messages";
import { SettingsIcon } from "lucide-react"; 
import Recorder, { mimeType } from "@/components/Recorder";
import { CgTranscript } from "react-icons/cg";
import {useRef, useState, useEffect} from "react";
import { useFormState } from "react-dom";
import transcript from '@/actions/transcript';
import VoiceSynthesizer from "@/components/VoiceSynthesizer";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export type Message = {
  sender: string;
  response: string;
  id: string;
};



export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef= useRef<HTMLButtonElement | null>(null);
  const [state, formAction] = useFormState(transcript, initialState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(false); 
  const [displaySettings, setDisplaySettings] = useState(false);
  
  // Responsible for updating the messages when the Server Action completes
  useEffect(()=> {
  if (state.response && state.sender) {
    setMessages((messages) => [
      {
        sender: state.sender || "",
        response: state.response || "",
        id: state.id || ""
      },
      ...messages,
    ]);
  }
  }, [state])

  const uploadAudio = (blob: Blob) => {
    const file = new File([blob], "audio.webm", { type: mimeType });

    // set the file as the value of the hidden file input field
    if (fileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files

      // simulate a click & submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }

    }

  };
  return (
    <main className="bg-gradient-to-b from-purple-300 to-blue-500 min-h-screen flex flex-col justify-center items-center">


     {/* Header */}
      <header className="flex justify-between items-center fixed top-0 right-0 w-full p-5">
        <Image 
          src="/survey_logo.png" 
          alt="logo" 
          width={200} 
          height={200}
        />

        {/* Icons Container */}
        <div className="flex items-center space-x-4"> {/* Added flex container for icons */}
          {/* Transcript Button */}
          <CgTranscript 
            size={40} 
            className="p-2 m-2 rounded-full cursor-pointer
              bg-transparent text-white border-2 border-white transition-all ease-in-out duration-150
              hover:bg-white hover:text-black shadow-lg hover:shadow-none"
            onClick={() => setShowTranscript(!showTranscript)} // Toggle transcript visibility
          />

          {/* Settings Button */}
          <SettingsIcon 
            size={40} 
            className="p-2 m-2 rounded-full cursor-pointer
              bg-transparent text-white border-2 border-white transition-all ease-in-out duration-150
              hover:bg-white hover:text-black shadow-lg hover:shadow-none" 
            onClick={() => setDisplaySettings(!displaySettings)}
          />
        </div>
      </header>

   

      {/* Background Image */}
    <div className="absolute top-40 right-0">
        <Image 
          src="/glass.png" 
          alt="glass" 
          objectFit="contain"
          width={2500} 
          height={2500}
          className="object-right-bottom z-0 opacity-50 rotate-6" // Adjust opacity as needed
        />
      </div>

    {/* Form */}
    <form action={formAction} className="flex flex-col min-h-screen bg-black justify-center items-center">
      <div className="flex-1 bg-gradient-to-b from-purple-300 to-blue-500 w-full flex justify-center items-center">
        {/* Container for Messages and Recorder */}
        <div className="w-[800px] h-[500px] bg-white rounded-lg flex flex-col justify-center items-center relative">

          {/* Hidden Fields */}
          <input type="file" name='audio' hidden ref={fileRef}/>
          <button type="submit" hidden ref={submitButtonRef}/>

          {/* Recorder - Always Visible */}
            <div className="flex justify-center items-center flex-1 z-10">
              <Recorder uploadAudio={uploadAudio}/> {/* Recorder button always visible */}
            </div>

          {/* Voice Synthesizer - output of the Assistant voice */}
          <div>
            <VoiceSynthesizer
            state={state}
            displaySettings={displaySettings}/>
          </div>
          
        </div>
        
        {/* Transcript box */}
        {showTranscript && (
            <div className="absolute right-10 top-25 w-[250px] h-[500px] bg-white rounded-lg shadow-lg p-4 overflow-y-auto">  {/* Adjusted overflow handling */}
              <Messages messages={messages} />
            </div>
          )}

      </div>
    </form>


    </main>
  );
}