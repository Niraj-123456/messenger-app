import ChatRoom from "./ChatRoom";
import ChatList from "../chat-list/ChatList";
import SelectedChatInfo from "../selected-chat-info/SelectedChatInfo";

const ChatRoomContainer = () => {
  return (
    <div className="w-full h-full flex divide-x">
      <ChatList />
      <ChatRoom />
      <SelectedChatInfo />
    </div>
  );
};

export default ChatRoomContainer;
