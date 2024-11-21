import CircularLoading from "@/components/common/circular-loading/CircularLoading";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  fetchPaginatedMessages,
  selectLoading,
  selectMessages,
  selectMetaData,
} from "@/redux/features/messages/messagesSlice";
import { useEffect, useRef } from "react";

const MessagesMain = () => {
  const dispatch = useAppDispatch();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fetchingMoreMessages = useAppSelector(selectLoading);
  const metadata = useAppSelector(selectMetaData);
  const currentPage = metadata?.pagination?.page ?? 1;
  const messages = useAppSelector(selectMessages);

  const sortedMessages = [...messages].sort((a, b) => a?.id - b?.id);

  useEffect(() => {
    const messagesContainer = messagesContainerRef?.current;
    if (!messagesContainer) return;

    if (fetchingMoreMessages) return;
    const handleScrollTop = () => {
      const { clientHeight, scrollHeight, scrollTop } = messagesContainer;
      const diff = clientHeight - scrollHeight;
      if (scrollTop - diff === 0) {
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
      className={cn(
        "w-full flex flex-col-reverse gap-4 overflow-auto",
        "custom_scroll"
      )}
      ref={messagesContainerRef}
    >
      {sortedMessages?.map((message, idx) => {
        const isLatestMessageInTheBlock = sortedMessages?.length - 10 === idx;
        return (
          <div
            id={`${
              isLatestMessageInTheBlock ? "latestMessageInTheBatch" : "message"
            }`}
            key={message?.id}
            className={cn(
              "border py-2 px-4 bg-gray-200 w-max rounded-full",
              idx % 2 === 0 ? "bg-gray-50" : "bg-gray-200 self-end"
            )}
          >
            {message?.name}
          </div>
        );
      })}

      {fetchingMoreMessages && (
        <div className="w-full p-1 flex justify-center">
          <CircularLoading size="2.5rem" thickness={3} />
        </div>
      )}
    </div>
  );
};

export default MessagesMain;
