import { Message } from "@/app/page";
import { ChevronDownCircle } from "lucide-react";
import LoadingMessage from "./LoadingMessage";

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {
  return (
    <div className="flex flex-col flex-1 p-3 pt-5 overflow-y-auto h-full"> {/* Ensure full height and scrollability */}

    <LoadingMessage />
      {!messages.length && (
        <div className="flex flex-col space-y-5 flex-1 items-center justify-end">
          <p className="text-purple-200 animate-pulse text-sm">Start the Interview</p>
          <ChevronDownCircle
            size={28} 
            className="animate-bounce text-purple-200"
          />
        </div>
      )}

      <div className="space-y-2"> {/* Adjusted spacing between messages */}
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {/* Receiver */}
            <div className="pr-2 max-w-full"> {/* Adjusted to take full width */}
              <p className="message bg-gray-700 rounded-bl-none text-sm p-2 break-words"> {/* Break long words */}
                {message.response}
              </p>
            </div>

            {/* Sender */}
            <div className="pl-2 max-w-full ml-auto"> {/* Adjusted to take full width */}
              <p className="message text-left bg-blue-500 text-white rounded-br-none text-sm p-2 break-words"> {/* Break long words */}
                {message.sender}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
