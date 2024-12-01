import CustomAvatar from "@/components/common/CustomAvatar";
import { useAppSelector } from "@/redux/app/hooks";
import {
  selectIsCurrentUserBlocked,
  selectSelectedChat,
} from "@/redux/features/chats/chatsSlice";
import { Phone, Video } from "lucide-react";

const SenderInfo = () => {
  const chat = useAppSelector(selectSelectedChat);
  const isCurrentUserBlocked = useAppSelector(selectIsCurrentUserBlocked);
  const user = chat?.user;
  return (
    <div className="w-full flex gap-4 items-center px-4 py-3">
      <div className="relative w-full">
        <div className="flex gap-2 items-center">
          <CustomAvatar
            src={isCurrentUserBlocked ? "" : user?.photoUrl}
            name={user?.displayName}
            className="w-14 h-14"
          />
          <div>
            <p className="text-lg font-semibold">
              {isCurrentUserBlocked ? "User" : user?.displayName}
            </p>
            <p className="text-xs text-gray-500 pl-1">
              {user?.status === "active" ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Phone className="w-5 h-5 cursor-pointer hover:text-gray-500" />
        <Video className="w-5 h-5 cursor-pointer hover:text-gray-500" />
      </div>
    </div>
  );
};

export default SenderInfo;
