import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { stringToColor } from "@/lib/stringHelper";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import FriendList from "./FriendList";
import { LogOut, MoreHorizontal, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { logOut, selectLoggedInUser } from "@/redux/features/user/userSlice";
import { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import CustomAvatar from "../common/CustomAvatar";
import {
  storeChats,
  storeSelectedChat
} from "@/redux/features/chats/chatsSlice";
import CircularLoading from "../common/circular-loading/CircularLoading";

const ChatList = () => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [userSearchList, setUserSearchList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [chatList, setChatList] = useState<any>([]);

  const handleSignout = async () => {
    try {
      await signOut(auth);
      dispatch(logOut());
    } catch (ex) {
      console.log("error", ex);
    }
  };

  const handleSearchUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username");
    if (username === "") return;
    const userRef = collection(db, "users");
    const q = query(userRef, where("displayName", "==", username));
    try {
      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        const result = [] as any[];
        querySnapShot.forEach((doc) => {
          result.push(doc.data());
        });
        setUserSearchList(result);
      }
    } catch (ex) {
      console.log("error", ex);
    } finally {
      setSearching(false);
    }
  };

  const handleAddUser = async (user: any) => {
    setAdding(true);
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: loggedInUser?.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, loggedInUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user?.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (ex) {
      console.log("error", ex);
    } finally {
      setAdding(false);
    }
  };

  const handleOpenUserAddDialog = () => {
    setUserSearchList([]);
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!loggedInUser) return;
    const unSub = onSnapshot(
      doc(db, "userchats", loggedInUser?.id as string),
      async (res) => {
        const chats = res.data()?.chats;
        const promises = chats?.map(async (chat: any) => {
          const userDocRef = doc(db, "users", chat?.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...chat, user };
        });
        const chatData = await Promise.all(promises);
        const sortedChatData = chatData.sort(
          (a, b) => b?.updatedAt - a?.updatedAt
        );
        setLoading(false);
        setChatList(sortedChatData);
        dispatch(storeChats(sortedChatData));
        dispatch(
          storeSelectedChat({
            chat: sortedChatData[0],
            currentUser: loggedInUser,
            user: sortedChatData[0]?.user,
          })
        );
      }
    );

    return () => unSub();
  }, [loggedInUser?.id]);

  return (
    <div className="w-full flex flex-col divide-y-2 max-w-sm *:p-4">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <CustomAvatar
              src={loggedInUser?.photoUrl!}
              name={loggedInUser?.displayName!}
              className="w-14 h-14"
            />

            <div>
              <p className="text-lg font-semibold">
                {loggedInUser?.displayName}
              </p>
              <p className="text-sm text-gray-500">{loggedInUser?.email}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="cursor-pointer hover:text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Logout <LogOut className="ml-auto" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 ">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 placeholder:text-md"
            />
            <Search className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          </div>

          <Button onClick={handleOpenUserAddDialog}>
            <Plus />
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <h4 className="font-semibold">Friends</h4>
        <div
          className={cn(
            "w-full flex gap-4 mt-2 pb-2 overflow-y-auto",
            "custom_scroll"
          )}
        >
          {chatList?.map((chat: any) => (
            <div key={chat?.chatId} className="flex-shrink-0">
              <div className="w-14 h-14 relative">
                <Avatar className="w-full h-full">
                  <AvatarImage src={chat?.user?.photoUrl} />
                  <AvatarFallback
                    style={{
                      backgroundColor:
                        stringToColor(chat?.user?.displayName) + "4D",
                      color: stringToColor(chat?.user?.displayName),
                    }}
                  >
                    {chat?.user?.displayName?.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                {chat?.user?.status === "active" && (
                  <>
                    <div className="border border-green-600 w-2 h-2 rounded-full absolute bottom-2 right-0 animate-ping" />
                    <div className=" w-2 h-2 bg-green-600 rounded-full absolute bottom-2 right-0" />
                  </>
                )}
              </div>

              <div className="pt-1 font-semibold text-xs text-center text-gray-500 max-w-24 overflow-hidden text-ellipsis">
                {chat?.user?.displayName?.split(" ")[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex-1">
        <h4 className="font-semibold">Chats</h4>
        <div className="mt-2">
          <Tabs defaultValue="All">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="New">New</TabsTrigger>
              <TabsTrigger value="Closed">Closed</TabsTrigger>
            </TabsList>
            <TabsContent value="All">
              <div
                className={cn(
                  "flex flex-col divide-y overflow-auto h-full max-h-[calc(100vh-26.8rem)] *:p-4",
                  "custom_scroll"
                )}
              >
                {loading ? (
                  <>
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <div key={idx} className="flex gap-2 w-full items-center">
                        <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                        <div className="w-full flex flex-col gap-2">
                          <Skeleton className="w-full h-3" />
                          <Skeleton className="w-[40%] h-3" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  chatList?.map((chat: any) => (
                    <FriendList key={chat?.chatId} chat={chat} />
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="New">New Messages</TabsContent>
            <TabsContent value="Closed">Closed Messages</TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenUserAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search User</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="w-full">
            <form onSubmit={handleSearchUser}>
              <div className="flex gap-2">
                <Input name="username" />
                <Button>Search</Button>
              </div>
            </form>

            {searching ? (
              <div className="flex gap-2 mt-4">
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex flex-col justify-center gap-3 w-full">
                  <Skeleton className="w-[40%] h-2" />
                  <Skeleton className="w-[20%] h-2" />
                </div>
              </div>
            ) : (
              userSearchList?.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                  {userSearchList?.map((user) => (
                    <div
                      key={user?.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex gap-3 items-center">
                        <CustomAvatar
                          src={user?.photoUrl}
                          name={user?.displayName}
                          className="w-8 h-8"
                        />
                        <div>{user?.displayName}</div>
                      </div>
                      <Button
                        size={"sm"}
                        className="h-8"
                        onClick={() => handleAddUser(user)}
                        disabled={adding}
                      >
                        Add
                        {adding && <CircularLoading color="#fff" />}
                      </Button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatList;
