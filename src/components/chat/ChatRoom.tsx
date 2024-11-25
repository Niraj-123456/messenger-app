import CircularLoading from "@/components/common/circular-loading/CircularLoading";
import MessageSendInput from "./MessageSendInput";
import SenderInfo from "./SenderInfo";
import ChatMessages from "./ChatMessages";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/app/hooks";
import { getDocs } from "firebase/firestore";

const ChatRoom = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // const getUsers = async () => {
  //   try {
  //     const usersShapShot = getDocs(doc(db, "users"))
  //     dispatch(userList(res?.data?.data));
  //     dispatch(storeSelectedUser(res?.data?.data[0]));
  //     dispatch(storeMessages(res?.data?.data));
  //     dispatch(storeMetaData(res?.data?.meta));
  //   } catch (ex) {
  //     // console.log("error", ex);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  if (loading) {
    return (
      <div className="flex justify-center w-full h-full p-8">
        <CircularLoading size="3rem" thickness={4} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col divide-y">
      <SenderInfo />
      <ChatMessages />
      <MessageSendInput />
    </div>
  );
};

export default ChatRoom;
