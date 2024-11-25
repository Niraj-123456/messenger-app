import ChatRoom from "./ChatRoom";
import UserList from "../userlist/UserList";
import SelectedFriendInfo from "../selected-friend-info/SelectedFriendInfo";

const ChatRoomContainer = () => {
  return (
    <div className="w-full h-full flex divide-x">
      <UserList />
      <ChatRoom />
      <SelectedFriendInfo />
    </div>
  );
};

export default ChatRoomContainer;
