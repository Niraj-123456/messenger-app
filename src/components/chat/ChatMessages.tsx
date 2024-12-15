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
  selectBlocked,
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
  const blocked = useAppSelector(selectBlocked);
  const sortedMessages = [...messages]?.sort(
    (a, b) => a?.createdAt - b?.createdAt
  );

  const isReceiverBlocked = blocked?.includes(selectedChat?.user?.id);
  const isCurrentUserBlocked = selectedChat?.user?.blocked?.includes(
    loggedInUser?.id
  );

  // useEffect(() => {
  //   const messagesContainer = messagesContainerRef?.current;
  //   if (!messagesContainer) return;

  //   if (fetchingMoreMessages) return;
  //   const handleScrollTop = () => {
  //     const { scrollTop } = messagesContainer;

  //     if (scrollTop <= 0) {
  //       dispatch(fetchPaginatedMessages(currentPage));
  //     }
  //   };

  //   messagesContainer?.addEventListener("scroll", handleScrollTop);

  //   return () => {
  //     messagesContainer?.removeEventListener("scroll", handleScrollTop);
  //   };
  // }, [
  //   messagesContainerRef?.current,
  //   dispatch,
  //   currentPage,
  //   fetchingMoreMessages,
  // ]);

  useEffect(() => {
    const lastestMessageElement = document.getElementById("#latestMessage");
    if (!lastestMessageElement) return;

    console.log("latest message", lastestMessageElement);

    lastestMessageElement?.scrollIntoView({
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
          "w-full min-h-[calc(100vh-140px)] flex flex-col gap-8 px-4 pt-4 pb-6",
          "custom_scroll"
        )}
      >
        {sortedMessages?.length > 0 ? (
          sortedMessages?.map((message, idx) => {
            const isLatestMessage = messages?.length - 1 === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "flex gap-2 items-start w-max",
                  loggedInUser?.id === message?.senderId
                    ? "self-end"
                    : "self-start"
                )}
                id={`${isLatestMessage ? "latestMessage" : "message"}`}
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
                    "flex flex-col gap-1",
                    loggedInUser?.id === message?.senderId
                      ? "items-end"
                      : "items-start"
                  )}
                >
                  {message?.imageUrl && (
                    <div className="w-48 h-auto rounded-md overflow-hidden">
                      <img src={message?.imageUrl} className="w-full h-full" />
                    </div>
                  )}
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
                        "absolute text-xs text-gray-400 pt-1 whitespace-nowrap",
                        loggedInUser?.id === message?.senderId
                          ? "right-0"
                          : "left-0"
                      )}
                    >
                      {getRelativeTime(message?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : isCurrentUserBlocked ? (
          <div className="w-full h-[calc(100vh-175px)] grid place-items-center">
            You are blocked
          </div>
        ) : isReceiverBlocked ? (
          <div className="w-full h-[calc(100vh-175px)] grid place-items-center">
            You have blocked this user
          </div>
        ) : (
          <div className="w-full h-[calc(100vh-175px)] flex flex-col justify-center items-center">
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
