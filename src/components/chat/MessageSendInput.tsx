import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import ToolTip from "@/components/common/ToolTip";
import { Button } from "@/components/ui/button";
import { Camera, CircleX, Image, Mic, SendHorizonal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { addNewMessage } from "@/redux/features/messages/messagesSlice";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from "emoji-picker-react";
import Emoji from "../../assets/images/smiling-emoji.svg";
import { selectLoggedInUser } from "@/redux/features/user/userSlice";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { selectBlocked } from "@/redux/features/chats/chatsSlice";
import { cn } from "@/lib/utils";
import useClickOutside from "@/hooks/useClickOutside";
import { firebaseUpload } from "@/lib/upload";

export interface Emoji {
  activeSkinTone: string;
  emoji: string;
  imageUrl: string;
  isCustom: boolean;
  names: string[];
  unified: string;
  unifiedWithoutSkinTone: string;
}

export interface MessageSendInputProps {
  selectedChat: any;
}

const MessageSendInput = ({ selectedChat }: MessageSendInputProps) => {
  const dispatch = useAppDispatch();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const blocked = useAppSelector(selectBlocked);
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [upload, setUpload] = useState<{
    file: File | null;
    url: ArrayBuffer | string | null;
  }>({
    file: null,
    url: "",
  });

  const emojiWrapperRef = useClickOutside(() => setOpenEmoji(false));
  const isReceiverBlocked = blocked?.includes(selectedChat?.user?.id);
  const isCurrentUserBlocked = selectedChat?.user?.blocked?.includes(
    loggedInUser?.id
  );

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (!files || files.length <= 0) {
      return;
    }
    const file = files[0];
    setUpload({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const handleSendMessage = async () => {
    // if (message === "") return;
    let imgUrl = null;

    const messageObj = {
      senderId: loggedInUser?.id,
      text: message,
      createdAt: Date.now(),
      ...(imgUrl ? { imageUrl: imgUrl } : {}),
    };

    console.log("image url", imgUrl);

    const userIds = [loggedInUser?.id, selectedChat?.user?.id];

    try {
      if (upload.file) {
        imgUrl = await firebaseUpload(upload.file);
      }

      await updateDoc(doc(db, "chats", selectedChat?.chatId), {
        messages: arrayUnion({ ...messageObj }),
      });

      userIds?.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id as string);
        const userChatsShapshot = await getDoc(userChatsRef);

        if (userChatsShapshot.exists()) {
          const userChatsData = userChatsShapshot.data();

          const chatIndex = userChatsData?.chats?.findIndex(
            (chat: any) => chat?.chatId === selectedChat?.chatId
          );

          userChatsData.chats[chatIndex].lastMessage = message;
          userChatsData.chats[chatIndex].isSeen = id === loggedInUser?.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
      dispatch(addNewMessage(messageObj));
    } catch (ex) {
      console.log("error", ex);
    }
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
    <div className="px-4 py-2 border-t">
      <div className="flex gap-2 items-center ">
        <div className="flex gap-2 items-center">
          <input
            type="file"
            ref={uploadInputRef}
            hidden
            onChange={(e) => handleUploadImage(e)}
          />
          <ToolTip title="Choose Image">
            <Button
              className="bg-transparent p-0 m-0 h-max [&_svg]:size-5 hover:bg-transparent *:hover:opacity-80 "
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              onClick={() => {
                uploadInputRef.current?.click();
              }}
            >
              <Image className="text-gray-500 cursor-pointer hover:text-gray-800" />
            </Button>
          </ToolTip>
          <ToolTip title="Open camera">
            <Button
              className="bg-transparent p-0 m-0 h-max [&_svg]:size-5 hover:bg-transparent *:hover:opacity-80"
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            >
              <Camera className="text-gray-500 cursor-pointer hover:text-gray-800" />
            </Button>
          </ToolTip>
          <ToolTip title="Choose audio">
            <Button
              className="bg-transparent p-0 m-0 h-max [&_svg]:size-5 hover:bg-transparent *:hover:opacity-80"
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            >
              <Mic className="text-gray-500 cursor-pointer hover:text-gray-800" />
            </Button>
          </ToolTip>
        </div>

        <Textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type here..."
          }
          className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] py-2 pl-0 custom_scroll disabled:cursor-not-allowed"
          onKeyDown={handleEnterKeyPressed}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div
          ref={emojiWrapperRef}
          role="button"
          className={cn(
            "w-7 h-7 p-1 bg-transparent relative hover:bg-transparent",
            isCurrentUserBlocked || isReceiverBlocked
              ? "pointer-events-none"
              : "cursor-pointer"
          )}
          onClick={() => setOpenEmoji((prev) => !prev)}
        >
          <img
            src={Emoji}
            alt=""
            className={cn(
              "w-full h-full absolute inset-0 transition-all duration-200 ease-in-out hover:scale-110",
              isCurrentUserBlocked || isReceiverBlocked ? "grayscale" : ""
            )}
          />
          <div className="absolute bottom-8 right-0">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>

        <Button
          onClick={handleSendMessage}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
          <SendHorizonal />
        </Button>
      </div>
      {upload?.url && (
        <div className="px-[5.5rem] flex">
          <div className="w-8 h-8 rounded-sm overflow-hidden relative">
            <img
              src={upload?.url as string}
              alt=""
              className="w-full h-full object-cover absolute inset-0"
            />
            <CircleX className="w-4 h-4 absolute top-2 -right-2 z-20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSendInput;
