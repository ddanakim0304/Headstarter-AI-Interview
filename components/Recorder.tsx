'use client'

import Image from "next/image";
import activeAssistantIcon from "@/img/active_survey.gif";
import notActiveAssistantIcon from "@/img/inactive_survey.png";
import { useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: {uploadAudio : (blob: Blob) => void}) {

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const {pending} = useFormStatus();
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [showTapToStart, setShowTapToStart] = useState(true); 

    useEffect(() => {
        getMicrophonePermission();
    }, []);

    const getMicrophonePermission = async() => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
                setPermission(true);
                setStream(streamData);

            } catch (err: any) {
                alert(err.message)
            }} else {
                alert("The MediaRecorder API is not supported in your browser.")
            }
    };

    const startRecording = async () => {
        if (stream === null || pending) return;

        setRecordingStatus("recording");

        // Create a new media recorder instance using the stream
        const media = new MediaRecorder(stream, {mimeType});
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        let localAudioChunks: Blob[] = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;

            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);

    };

    const stopRecording = async () => {
        if (mediaRecorder.current === null || pending) return;

        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, {type: mimeType});
            uploadAudio(audioBlob);
            setAudioChunks([]); //start at a clean state
        };
    };

    const handleStartClick = () => {
        setShowTapToStart(false); // Hide "Tap to Start" text when clicked
        startRecording(); // Start recording
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            {!permission && (
                <button onClick={getMicrophonePermission}></button>
            )}
    
            {pending && (
                <Image 
                    src={notActiveAssistantIcon}
                    alt="mic icon" 
                    priority
                    className="assistant mt-2 grayscale"
                />
            )}
    
            {permission && recordingStatus === "inactive" && !pending && (
                <Image 
                    src={notActiveAssistantIcon}
                    alt = "Not Recording"
                    onClick={handleStartClick} // Custom click handler
                    priority={true}
                    className="assistant cursor-pointer"
                />
            )}
    
            {recordingStatus === "recording" && (
                <Image 
                    src={notActiveAssistantIcon}
                    alt = "Recording"
                    onClick={stopRecording}
                    priority={true}
                    className="assistant cursor-pointer"
                />
            )}

            {/* Conditionally render "Tap to Start" text */}
            {showTapToStart && recordingStatus === "inactive" && (
                <p className="text-purple-400 animate-pulse mt-1 text-lg">Tap to Start</p>
            )}
        </div>
    );
}

export default Recorder;
