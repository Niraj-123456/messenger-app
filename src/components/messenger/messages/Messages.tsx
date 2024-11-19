import { fetchMessages } from "@/api/messages";
import CircularLoading from "@/components/common/circular-loading/CircularLoading";
import ToolTip from "@/components/common/ToolTip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  addNewMessage,
  selectMessages,
  selectMetaData,
  storeMetaData,
  storeMoreMessages,
} from "@/redux/features/messages/messagesSlice";
import { selectSelectedUser } from "@/redux/features/user/usersSlice";
import { Bell, Ellipsis, Paperclip, Search, SendHorizonal } from "lucide-react";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

const Messages = ({ loading }: { loading: boolean }) => {
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const metadata = useAppSelector(selectMetaData);
  const messages = useAppSelector(selectMessages);
  const selectedUser = useAppSelector(selectSelectedUser);
  const currentPage = metadata?.pagination?.page ?? 1;
  const hasMore = !!metadata?.data?.pagination?.link?.nextCursor;
  const [fetchingMoreMessages, setFetchingMoreMessages] = useState(false);
  const [prevScrollHeight, setPrevAScrollHeight] = useState(0);

  const sortedMessages = [...messages].sort((a, b) => a?.id - b?.id);

  const handleEnterKeyPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleSendMessage = () => {
    if (!messageInputRef?.current) return;
    if (messageInputRef?.current?.value === "") {
      return;
    }

    const messageObj = {
      id: messages[messages?.length - 1]?.id - 1,
      email: "xyz@gmail.com",
      name: messageInputRef?.current?.value,
      gender: "male",
      status: "inactive",
    };
    dispatch(addNewMessage(messageObj));
    messageInputRef.current.value = "";
  };

  useEffect(() => {
    const messagesContainer = messagesContainerRef?.current;
    if (!messagesContainer) return;

    messagesContainer.scrollTo({
      behavior: "smooth",
      top: prevScrollHeight,
    });
  }, [messages]);

  const fetchMoreMessages = async () => {
    setFetchingMoreMessages(true);
    try {
      const res = await fetchMessages(currentPage + 1);
      dispatch(storeMoreMessages(res?.data?.data));
      dispatch(storeMetaData(res?.data?.meta));
    } catch (ex) {
      // handle error
    } finally {
      setFetchingMoreMessages(false);
    }
  };

  useEffect(() => {
    const messagesContainer = messagesContainerRef?.current;
    const lastMessageElement = lastMessageRef?.current;
    if (!messagesContainer || !lastMessageElement) return;
    setPrevAScrollHeight(messagesContainer?.scrollHeight);

    const handleScrollTop = () => {
      if (fetchingMoreMessages) return;
      // const { clientHeight, scrollHeight, scrollTop } = messagesContainer;
      const containerRect = messagesContainer?.getBoundingClientRect();
      const elementRect = lastMessageElement?.getBoundingClientRect();

      if (
        elementRect?.top >= containerRect?.top &&
        elementRect?.bottom <= containerRect?.bottom
      ) {
        console.log("I am in view");
      }
    };

    messagesContainer?.addEventListener("scroll", handleScrollTop);

    return () => {
      messagesContainer?.removeEventListener("scroll", handleScrollTop);
    };
  }, [dispatch, messagesContainerRef?.current]);

  // const lastMessageRef = useCallback(
  //   (node: Element | null) => {
  //     console.log("I am here 104", observer.current);
  //     if (fetchingMoreMessages || !hasMore) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver(
  //       (entries) => {
  //         console.log("interacting", entries[0].isIntersecting);
  //         console.log("has more", hasMore);
  //         if (entries[0].isIntersecting && hasMore) {
  //           fetchMoreMessages();
  //         }
  //       },
  //       {
  //         root: null,
  //         threshold: 1.0,
  //         rootMargin: "0px",
  //       }
  //     );
  //     if (node) observer.current.observe(node);
  //   },
  //   [fetchingMoreMessages, hasMore]
  // );

  return (
    <div className="w-full flex flex-col divide-y relative">
      <div className="p-8">
        <div className="w-full flex gap-4 items-center">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 py-6 placeholder:text-md"
            />
            <Search className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-200 p-2 rounded-md">
              <Ellipsis />
            </div>
            <div className="bg-gray-200 p-2 rounded-md">
              <Bell />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="mt-8 flex justify-center">
            <CircularLoading size="3rem" thickness={4} />
          </div>
        ) : (
          <>
            <div className="relative w-max mt-8">
              <span className="text-lg font-semibold">
                {selectedUser?.name}
              </span>
              <span className="text-xs text-gray-500 pl-1">online</span>
            </div>
            <div
              className={cn(
                "w-full h-[550px] max-h-[500px] mt-4 flex flex-col-reverse gap-4 overflow-auto p-2",
                "custom_scroll"
              )}
              ref={messagesContainerRef}
            >
              {sortedMessages?.map((message, idx) => (
                <div
                  ref={
                    idx === sortedMessages?.length - 1 ? lastMessageRef : null
                  }
                  key={message?.id}
                  className={cn(
                    "border py-2 px-4 bg-gray-200 w-max rounded-md",
                    idx % 2 === 0 ? "bg-gray-50" : "bg-gray-200 self-end"
                  )}
                >
                  {message?.name}
                </div>
              ))}

              {fetchingMoreMessages && (
                <div
                  ref={lastMessageRef}
                  className="w-full p-1 border flex justify-center"
                >
                  <CircularLoading size="2.5rem" thickness={3} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-0 p-4 w-full">
        <div className="relative flex items-center">
          <ToolTip title="Attach files">
            <Paperclip className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
          </ToolTip>
          <Input
            ref={messageInputRef}
            placeholder="Type here..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={handleEnterKeyPressed}
          />
          <Button
            className="absolute top-0 right-0"
            disabled={loading}
            onClick={handleSendMessage}
          >
            Send
            <SendHorizonal className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
