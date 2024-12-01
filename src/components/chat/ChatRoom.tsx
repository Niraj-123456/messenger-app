import CircularLoading from "@/components/common/circular-loading/CircularLoading";
import MessageSendInput from "./MessageSendInput";
import SenderInfo from "./SenderInfo";
import ChatMessages from "./ChatMessages";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { doc, onSnapshot } from "firebase/firestore";
import { selectSelectedChat } from "@/redux/features/chats/chatsSlice";
import { db } from "@/lib/firebase";
import { storeMessages } from "@/redux/features/messages/messagesSlice";

const ChatRoom = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const selectedChat = useAppSelector(selectSelectedChat);

  useEffect(() => {
    if (!selectedChat) return;
    const unSub = onSnapshot(
      doc(db, "chats", selectedChat?.chatId as string),
      async (res) => {
        setLoading(false);
        const chatMessages = res.data()?.messages;
        dispatch(storeMessages(chatMessages));
      }
    );

    return () => unSub();
  }, [selectedChat?.chatId]);

  if (loading) {
    return (
      <div className="flex justify-center w-full h-full p-8">
        <CircularLoading size="3rem" thickness={4} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col divide-y">
      <SenderInfo />
      <ChatMessages />
      <MessageSendInput selectedChat={selectedChat} />
    </div>
  );
};

export default ChatRoom;
