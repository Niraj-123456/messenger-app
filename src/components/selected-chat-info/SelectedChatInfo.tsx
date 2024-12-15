import { useState } from "react";
import CustomAvatar from "@/components/common/CustomAvatar";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  selectBlocked,
  selectSelectedChat,
  toggleBlockUser,
} from "@/redux/features/chats/chatsSlice";
import { selectLoggedInUser } from "@/redux/features/user/userSlice";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Ellipsis, MessageCircle, Phone, Video } from "lucide-react";
import CircularLoading from "../common/circular-loading/CircularLoading";

const SelectedChatInfo = () => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const blocked = useAppSelector(selectBlocked);

  const chat = useAppSelector(selectSelectedChat);
  const user = chat?.user;

  const [blockToggling, setBlockToggling] = useState(false);

  const isReceiverBlocked = blocked?.includes(user?.id);
  const isCurrentUserBlocked = user?.blocked?.includes(loggedInUser?.id);

  const handleToggleBlockUser = async () => {
    if (!user) return;
    setBlockToggling(true);
    const userDocRef = doc(db, "users", loggedInUser?.id as string);

    try {
      await updateDoc(userDocRef, {
        blocked: blocked?.includes(user?.id)
          ? arrayRemove(user?.id)
          : arrayUnion(user?.id),
      });
      dispatch(toggleBlockUser(user?.id));
    } catch (ex) {
      // handle error
    } finally {
      setBlockToggling(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xs divide-y *:p-4">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-16 h-16 relative">
          <CustomAvatar
            src={!isCurrentUserBlocked ? user?.photoUrl : ""}
            name={user?.displayName}
            className="w-full h-full text-2xl"
          />
          {user?.status === "active" && (
            <>
              <div className="border border-green-600 w-2.5 h-2.5 rounded-full absolute bottom-1 right-1 animate-ping" />
              <div className=" w-2.5 h-2.5 bg-green-600 rounded-full absolute bottom-1 right-1" />
            </>
          )}
        </div>
        <div className="mt-2 text-center">
          <h4 className="font-semibold text-xl">
            {isCurrentUserBlocked ? "User" : user?.displayName}
          </h4>
          <p className="text-gray-500 text-xs pt1">
            {isCurrentUserBlocked ? "-" : user?.email}
          </p>
        </div>
      </div>
      <div className="pt-6">
        <div className="flex justify-between max-w-xs mx-auto">
          <div className="flex flex-col gap-1 items-center">
            <Button className="w-10 h-10 rounded-full bg-blue-200 grid place-items-center cursor-pointer hover:bg-blue-300 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0 *:fill-blue-700 *:stroke-blue-700">
              <Phone className="w-4 h-4" />
            </Button>
            <div className="text-xs font-medium">Call</div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Button className="w-10 h-10 rounded-full bg-blue-200 grid place-items-center cursor-pointer hover:bg-blue-300 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0 *:fill-blue-700 *:stroke-blue-700">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <div className="text-xs font-medium">Message</div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Button className="w-10 h-10 rounded-full bg-blue-200 grid place-items-center cursor-pointer hover:bg-blue-300 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0 *:fill-blue-700 *:stroke-blue-700">
              <Video className="w-4 h-4" />
            </Button>
            <div className="text-xs font-medium">Video</div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Button className="w-10 h-10 rounded-full bg-blue-200 grid place-items-center cursor-pointer hover:bg-blue-300 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0 *:fill-blue-700 *:stroke-blue-700">
              <Ellipsis className="w-4 h-4" />
            </Button>
            <div className="text-xs font-medium">More</div>
          </div>
        </div>
      </div>
      <div className="p-2 flex flex-col gap-3 w-full">
        <div>
          <div className="font-semibold">Phone</div>
          <div className="text-sm text-gray-500">+9779845673838</div>
        </div>
        <div>
          <div className="font-semibold">Date of Birth</div>
          <div className="text-sm text-gray-500 capitalize">17 march 1990</div>
        </div>
        <div>
          <div className="font-semibold">Gender</div>
          <div className="text-sm text-gray-500 capitalize">
            {user?.gender ?? "-"}
          </div>
        </div>
      </div>
      <div>
        <Button
          className="w-full"
          disabled={blockToggling || isCurrentUserBlocked}
          onClick={handleToggleBlockUser}
        >
          {isReceiverBlocked
            ? "UnBlocked User"
            : isCurrentUserBlocked
            ? "You are Blocked"
            : "Block User"}
          {blockToggling && <CircularLoading size="1.5rem" color="#fff" />}
        </Button>
      </div>
    </div>
  );
};

export default SelectedChatInfo;
