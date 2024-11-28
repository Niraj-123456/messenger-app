import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stringToColor } from "@/lib/stringHelper";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  selectSelectedChat,
  storeSelectedChat,
} from "@/redux/features/chats/chatsSlice";

const FriendList = ({ chat }: { chat: any }) => {
  const user = chat?.user;
  const dispatch = useAppDispatch();
  const selectedChat = useAppSelector(selectSelectedChat);

  const handleChangeSelectedUser = (chat: any) => {
    dispatch(storeSelectedChat(chat));
  };

  return (
    <div
      className={cn(
        "flex gap-4 items-center cursor-pointer hover:bg-gray-100",
        selectedChat?.chatId === chat?.chatId ? "bg-gray-100" : ""
      )}
      onClick={() => handleChangeSelectedUser(chat)}
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src={user?.photoUrl} />
        <AvatarFallback
          style={{
            backgroundColor: stringToColor(user?.displayName) + "4D",
            color: stringToColor(user?.displayName),
          }}
        >
          {user?.displayName.substring(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{user?.displayName}</p>
        <p className="text-sm text-gray-500">{chat?.lastMessage}</p>
      </div>
    </div>
  );
};

export default FriendList;
