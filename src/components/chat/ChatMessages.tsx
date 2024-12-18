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
import { selectLoggedInUser } from "@/redux/features/user/userSlice";
import { getRelativeTime } from "@/lib/date-time";
import {
  selectIsCurrentUserBlocked,
  selectIsReceiverBlocked,
  selectSelectedChat,
} from "@/redux/features/chats/chatsSlice";

const ChatMessages = () => {
  const dispatch = useAppDispatch();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fetchingMoreMessages = useAppSelector(selectLoading);
  const metadata = useAppSelector(selectMetaData);
  const currentPage = metadata?.pagination?.page ?? 1;
  const messages = useAppSelector(selectMessages);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const selectedChat = useAppSelector(selectSelectedChat);
  const isCurrentUserBlocked = useAppSelector(selectIsCurrentUserBlocked);
  const isReceiverBlocked = useAppSelector(selectIsReceiverBlocked);
  const sortedMessages = [...messages]?.sort(
    (a, b) => b?.createdAt - a?.createdAt
  );

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
  }, [sortedMessages]);

  return (
    <div
      ref={messagesContainerRef}
      className="w-full overflow-auto custom_scroll"
    >
      <div
        className={cn(
          "w-full h-[calc(100vh-140px)] max-h-[calc(100vh-140px)] flex flex-col-reverse justify-end gap-8 px-6 py-4",
          "custom_scroll"
        )}
      >
        {sortedMessages?.length > 0 ? (
          sortedMessages?.map((message, idx) => {
            const isLatestMessageInTheBlock = messages?.length - 10 === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "flex gap-2 items-start w-max",
                  loggedInUser?.id === message?.senderId
                    ? "self-end"
                    : "self-start"
                )}
                id={`${
                  isLatestMessageInTheBlock
                    ? "latestMessageInTheBatch"
                    : "message"
                }`}
              >
                <CustomAvatar
                  src={
                    isCurrentUserBlocked || isReceiverBlocked
                      ? ""
                      : selectedChat?.user?.photoUrl
                  }
                  name={selectedChat?.user?.displayName}
                  className={cn(
                    loggedInUser?.id === message?.senderId ? "hidden" : "flex",
                    "w-[2rem] h-[2rem]"
                  )}
                />
                <div
                  className={cn(
                    "relative border py-1 px-3 bg-gray-200 w-max rounded-2xl max-w-80 text-base",
                    loggedInUser?.id === message?.senderId
                      ? "bg-gray-200"
                      : "bg-gray-50",
                    isCurrentUserBlocked ? "blur-sm" : ""
                  )}
                >
                  {message?.text}
                  <div
                    className={cn(
                      "absolute text-xs text-gray-400 pt-1",
                      loggedInUser?.id === message?.senderId
                        ? "right-0"
                        : "left-0"
                    )}
                  >
                    {getRelativeTime(message?.createdAt)}
                  </div>
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
