import CircularLoading from "@/components/common/circular-loading/CircularLoading";
import SendMessageContainer from "./SendMessageContainer";
import SenderInfo from "./SenderInfo";
import MessagesMain from "./MessagesMain";

const Messages = ({ loading }: { loading: boolean }) => {
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
      <MessagesMain />
      <SendMessageContainer />
    </div>
  );
};

export default Messages;
