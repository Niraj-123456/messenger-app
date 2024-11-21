import { useAppDispatch } from "@/redux/app/hooks";
import Messages from "./messages/Messages";
import UserList from "./userlist/UserList";
import { useEffect, useState } from "react";
import { fetchUserList } from "@/api/users";
import { storeSelectedUser, userList } from "@/redux/features/user/usersSlice";
import {
  storeMessages,
  storeMetaData,
} from "@/redux/features/messages/messagesSlice";

const MessengerContainer = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await fetchUserList(1);
      dispatch(userList(res?.data?.data));
      dispatch(storeSelectedUser(res?.data?.data[0]));
      dispatch(storeMessages(res?.data?.data));
      dispatch(storeMetaData(res?.data?.meta));
    } catch (ex) {
      // console.log("error", ex);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-h-[calc(100vh-400px)] h-full flex divide-x max-w-7xl mx-auto border">
      <UserList loading={loading} />
      <Messages loading={loading} />
    </div>
  );
};

export default MessengerContainer;
