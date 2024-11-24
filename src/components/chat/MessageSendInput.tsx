import { KeyboardEvent, useState } from "react";
import ToolTip from "@/components/common/ToolTip";
import { Button } from "@/components/ui/button";
import { Camera, Image, Mic, SendHorizonal } from "lucide-react";
import { useAppDispatch } from "@/redux/app/hooks";
import { addNewMessage } from "@/redux/features/messages/messagesSlice";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from "emoji-picker-react";
import Emoji from "../../assets/images/smiling-emoji.svg";

export interface Emoji {
  activeSkinTone: string;
  emoji: string;
  imageUrl: string;
  isCustom: boolean;
  names: string[];
  unified: string;
  unifiedWithoutSkinTone: string;
}

const MessageSendInput = () => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);

  console.log("message", message);

  const handleSendMessage = () => {
    if (message === "") {
      return;
    }

    const messageObj = {
      id: 11111,
      email: "xyz@gmail.com",
      name: message,
      gender: "male",
      status: "inactive",
    };
    dispatch(addNewMessage(messageObj));
    setMessage("");
  };

  const handleEnterKeyPressed = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmoji = (e: Emoji) => {
    setMessage((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  return (
    <div className="flex gap-2 items-center px-4 py-2 border-t">
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
      <Textarea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type here..."
        className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] py-2 pl-0 custom_scroll"
        onKeyDown={handleEnterKeyPressed}
      />

      <div
        className="w-7 h-7 relative cursor-pointer transition-all duration-200 ease-in-out "
        onClick={() => setOpenEmoji((prev) => !prev)}
      >
        <img
          src={Emoji}
          alt=""
          className="w-full h-full absolute inset-0 hover:scale-110"
        />
        <div className="absolute bottom-8 right-0">
          <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
        </div>
      </div>

      <Button onClick={handleSendMessage}>
        Send
        <SendHorizonal className="ml-2" />
      </Button>
    </div>
  );
};

export default MessageSendInput;
