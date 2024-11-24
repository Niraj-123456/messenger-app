import CustomAvatar from "@/components/common/CustomAvatar";
import { useAppSelector } from "@/redux/app/hooks";
import { selectSelectedUser } from "@/redux/features/users/usersSlice";
import { Info, Phone, Video } from "lucide-react";

const SenderInfo = () => {
  const senderInfo = useAppSelector(selectSelectedUser);
  return (
    <div className="w-full flex gap-4 items-center px-4 py-3">
      <div className="relative w-full">
        <div className="flex gap-2 items-center">
          <CustomAvatar src="" name={senderInfo?.name} className="w-14 h-14" />
          <div>
            <p className="text-lg font-semibold">{senderInfo?.name}</p>
            <p className="text-xs text-gray-500 pl-1">
              {senderInfo?.status === "active" ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Phone className="w-5 h-5 cursor-pointer hover:text-gray-500" />
        <Video className="w-5 h-5 cursor-pointer hover:text-gray-500" />
        <Info className="w-5 h-5 cursor-pointer hover:text-gray-500" />
      </div>
    </div>
  );
};

export default SenderInfo;
