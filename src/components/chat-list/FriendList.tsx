import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { stringToColor } from "@/lib/stringHelper";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  selectIsCurrentUserBlocked,
  selectSelectedChat,
  storeSelectedChat,
} from "@/redux/features/chats/chatsSlice";
import { selectLoggedInUser } from "@/redux/features/user/userSlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const FriendList = ({ chat }: { chat: any }) => {
  const user = chat?.user;
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const selectedChat = useAppSelector(selectSelectedChat);
  const isCurrentUserBlocked = useAppSelector(selectIsCurrentUserBlocked);

  const handleChangeSelectedUser = async (chat: any) => {
    try {
      const userChatsRef = doc(db, "userchats", loggedInUser?.id as string);
      const userChatsShapshot = await getDoc(userChatsRef);

      if (userChatsShapshot.exists()) {
        const userChatsData = userChatsShapshot.data();

        const chatIndex = userChatsData?.chats?.findIndex(
          (chat: any) => chat?.chatId === selectedChat?.chatId
        );

        userChatsData.chats[chatIndex].isSeen = true;

        await updateDoc(userChatsRef, {
          chats: userChatsData.chats,
        });
      }
      dispatch(
        storeSelectedChat({
          chat: {
            ...chat,
            isSeen: true,
          },
          currentUser: loggedInUser,
          user: chat?.user,
        })
      );
    } catch (ex) {
      console.log("error", ex);
      // handle error
    }
  };

  const generateBgColor = () => {
    if (selectedChat?.isSeen) {
      if (selectedChat?.chatId === chat?.chatId) {
        return "bg-gray-200 hover:bg-gray-100";
      } else {
        return "";
      }
    } else {
      return "bg-blue-400 hover:bg-blue-100";
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 items-center cursor-pointer hover:bg-gray-100",
        generateBgColor()
      )}
      onClick={() => handleChangeSelectedUser(chat)}
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src={isCurrentUserBlocked ? "" : user?.photoUrl} />
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
        <p className="font-semibold">
          {isCurrentUserBlocked ? "User" : user?.displayName}
        </p>
        <p className="text-sm text-gray-500">
          {isCurrentUserBlocked ? "-" : chat?.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default FriendList;
