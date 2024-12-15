import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  selectSelectedChat,
  storeSelectedChat,
} from "@/redux/features/chats/chatsSlice";
import { selectLoggedInUser } from "@/redux/features/user/userSlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import CustomAvatar from "../common/CustomAvatar";

const FriendList = ({ chat }: { chat: any }) => {
  const user = chat?.user;
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const selectedChat = useAppSelector(selectSelectedChat);

  const isCurrentUserBlocked = user?.blocked?.includes(loggedInUser?.id);

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
          ...chat,
          isSeen: true,
        })
      );
    } catch (ex) {
      console.log("error", ex);
      // handle error
    }
  };

  const generateBgColor = () => {
    if (chat?.isSeen) {
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
      <CustomAvatar
        src={isCurrentUserBlocked ? "" : user?.photoUrl}
        name={user?.displayName}
        className="w-14 h-14"
      />
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
