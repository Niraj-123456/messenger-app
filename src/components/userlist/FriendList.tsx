import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stringToColor } from "@/lib/stringHelper";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  selectSelectedUser,
  storeSelectedUser,
} from "@/redux/features/users/usersSlice";

const FriendList = ({ friend }: { friend: any }) => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector(selectSelectedUser);

  const handleChangeSelectedUser = (user: any) => {
    dispatch(storeSelectedUser(user));
  };
  return (
    <div
      className={cn(
        "flex gap-4 items-center cursor-pointer hover:bg-gray-100",
        selectedUser?.id === friend?.id ? "bg-gray-100" : ""
      )}
      onClick={() => handleChangeSelectedUser(friend)}
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src="" />
        <AvatarFallback
          style={{
            backgroundColor: stringToColor(friend?.name) + "4D",
            color: stringToColor(friend?.name),
          }}
        >
          {friend?.name.substring(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{friend?.name}</p>
        <p className="text-sm text-gray-500">{friend?.name}</p>
      </div>
    </div>
  );
};

export default FriendList;
