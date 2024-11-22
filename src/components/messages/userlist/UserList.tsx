import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import UserImage from "../../../assets/images/random.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useAppSelector } from "@/redux/app/hooks";
import { stringToColor } from "@/lib/stringHelper";
import { cn } from "@/lib/utils";
import { selectUsers } from "@/redux/features/users/usersSlice";
import { Skeleton } from "@/components/ui/skeleton";
import FriendList from "./FriendList";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UserList = ({ loading }: { loading: boolean }) => {
  const users = useAppSelector(selectUsers);

  return (
    <div className="w-full flex flex-col divide-y-2 max-w-md *:p-4">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="w-14 h-14">
              <AvatarImage src={UserImage} />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <div className="mt-2">
              <p className="text-lg font-semibold">John Doe</p>
              <p className="text-sm text-gray-500">@john_doe</p>
            </div>
          </div>

          <MoreHorizontal className="cursor-pointer hover:text-gray-400" />
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

          <Button>
            <Plus />
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <h4 className="font-semibold">Friends</h4>
        <div
          className={cn(
            "w-full h-max flex gap-4 mt-2 pb-2 overflow-y-auto",
            "custom_scroll"
          )}
        >
          {users?.map((user) => (
            <div key={user?.id} className="flex-shrink-0">
              <div className="w-14 h-14 relative">
                <Avatar className="w-full h-full">
                  <AvatarImage src="" />
                  <AvatarFallback
                    style={{
                      backgroundColor: stringToColor(user?.name) + "4D",
                      color: stringToColor(user?.name),
                    }}
                  >
                    {user?.name?.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                {user?.status === "active" && (
                  <>
                    <div className="border border-green-600 w-2 h-2 rounded-full absolute bottom-2 right-0 animate-ping" />
                    <div className=" w-2 h-2 bg-green-600 rounded-full absolute bottom-2 right-0" />
                  </>
                )}
              </div>

              <div className="pt-1 font-semibold text-xs text-center text-gray-500 max-w-24 overflow-hidden text-ellipsis">
                {user?.name.split(" ")[0]}
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
                  "flex flex-col divide-y overflow-auto max-h-72 *:p-4",
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
                  users?.map((user) => (
                    <FriendList key={user?.id} friend={user} />
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="New">New Messages</TabsContent>
            <TabsContent value="Closed">Closed Messages</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserList;
