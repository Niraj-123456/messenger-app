import Login from "../login/Login";
import MessagesMainContainer from "../messages/MessagesMainContainer";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "@/lib/auth";
import { useAppSelector } from "@/redux/app/hooks";
import { selectUser } from "@/redux/features/user/userSlice";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const userFromStore = useAppSelector(selectUser);

  useEffect(() => {
    const user = getLoggedInUser();
    if (user?.displayName || userFromStore) {
      setLoggedInUser(user);
    } else {
      setLoggedInUser(null);
    }
  }, [userFromStore]);

  console.log("logged in user", loggedInUser);

  return (
    <div className="w-full max-h-[calc(100vh-400px)] h-[calc(100vh-400px)] max-w-7xl mx-auto border rounded-sm">
      {loggedInUser ? <MessagesMainContainer /> : <Login />}
    </div>
  );
};

export default Home;
