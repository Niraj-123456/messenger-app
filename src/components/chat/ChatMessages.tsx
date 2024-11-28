import { useEffect, useRef } from "react";
import CircularLoading from "@/components/common/circular-loading/CircularLoading";
import CustomAvatar from "@/components/common/CustomAvatar";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  fetchPaginatedMessages,
  selectLoading,
  selectMessages,
  selectMetaData,
} from "@/redux/features/messages/messagesSlice";
import NoChatMessages from "../../assets/images/start_chat.svg";

const ChatMessages = () => {
  const dispatch = useAppDispatch();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fetchingMoreMessages = useAppSelector(selectLoading);
  const metadata = useAppSelector(selectMetaData);
  const currentPage = metadata?.pagination?.page ?? 1;
  const messages = useAppSelector(selectMessages);

  useEffect(() => {
    const messagesContainer = messagesContainerRef?.current;
    if (!messagesContainer) return;

    if (fetchingMoreMessages) return;
    const handleScrollTop = () => {
      const { scrollTop } = messagesContainer;

      if (scrollTop <= 0) {
        dispatch(fetchPaginatedMessages(currentPage));
      }
    };

    messagesContainer?.addEventListener("scroll", handleScrollTop);

    return () => {
      messagesContainer?.removeEventListener("scroll", handleScrollTop);
    };
  }, [
    messagesContainerRef?.current,
    dispatch,
    currentPage,
    fetchingMoreMessages,
  ]);

  useEffect(() => {
    const latestMessageInTheBatch = document.querySelector(
      "#latestMessageInTheBatch"
    );

    if (!latestMessageInTheBatch) return;

    latestMessageInTheBatch.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className="w-full overflow-auto custom_scroll"
    >
      <div
        className={cn(
          "w-full h-[calc(100vh-140px)] max-h-[calc(100vh-140px)] flex flex-col-reverse justify-end gap-4 px-6 py-4",
          "custom_scroll"
        )}
      >
        {messages?.length > 0 ? (
          messages?.map((message, idx) => {
            const isLatestMessageInTheBlock = messages?.length - 10 === idx;
            return (
              <div
                id={`${
                  isLatestMessageInTheBlock
                    ? "latestMessageInTheBatch"
                    : "message"
                }`}
                key={message?.id}
                className={cn(
                  "flex gap-2 items-start w-full",
                  idx % 2 === 0 ? "justify-start" : "justify-end"
                )}
              >
                <CustomAvatar
                  src=""
                  name={message?.name}
                  className={cn(
                    idx % 2 === 0 ? "" : "order-last",
                    "w-[1.85rem] h-[1.85rem]"
                  )}
                />
                <div
                  className={cn(
                    "border py-1 px-3 bg-gray-200 w-max rounded-2xl max-w-80 text-sm",
                    idx % 2 === 0 ? "bg-gray-50" : "bg-gray-200"
                  )}
                >
                  {message?.name}
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-full h-[32rem] max-h-[32rem] relative">
              <img
                src={NoChatMessages}
                alt=""
                className="w-full h-full object-contain absolute inset-0"
              />
            </div>
            <p className="text-lg font-medium">You don't have any messages</p>
            <p className="text-sm text-gray-500 pt-2">
              Send message to start conversation
            </p>
          </div>
        )}

        {fetchingMoreMessages && (
          <div className="w-full p-1 flex justify-center">
            <CircularLoading size="2.5rem" thickness={3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
