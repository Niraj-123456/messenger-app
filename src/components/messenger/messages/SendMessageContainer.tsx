import { KeyboardEvent, useRef } from "react";
import ToolTip from "@/components/common/ToolTip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Image, Mic, SendHorizonal } from "lucide-react";
import { useAppDispatch } from "@/redux/app/hooks";
import { addNewMessage } from "@/redux/features/messages/messagesSlice";

const SendMessageContainer = () => {
  const dispatch = useAppDispatch();
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  const handleSendMessage = () => {
    if (!messageInputRef?.current) return;
    if (messageInputRef?.current?.value === "") {
      return;
    }

    const messageObj = {
      id: Number(new Date().getTime().toString().slice(-7)),
      email: "xyz@gmail.com",
      name: messageInputRef?.current?.value,
      gender: "male",
      status: "inactive",
    };
    dispatch(addNewMessage(messageObj));
    messageInputRef.current.value = "";
  };

  const handleEnterKeyPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };
  return (
    <div className="relative flex items-center px-4 py-2 border">
      <div className="flex gap-2 items-center">
        <ToolTip title="Choose Image">
          <Image className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
        </ToolTip>
        <ToolTip title="Open camera">
          <Camera className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
        </ToolTip>
        <ToolTip title="Choose audio">
          <Mic className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
        </ToolTip>
      </div>
      <Input
        ref={messageInputRef}
        placeholder="Type here..."
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        onKeyDown={handleEnterKeyPressed}
      />
      <Button className="absolute top-2 right-2" onClick={handleSendMessage}>
        Send
        <SendHorizonal className="ml-2" />
      </Button>
    </div>
  );
};

export default SendMessageContainer;
