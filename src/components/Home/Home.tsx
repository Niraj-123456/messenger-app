import Login from "../login/Login";
import ChatRoomContainer from "../chat/ChatRoomContainer";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/app/hooks";
import { logIn, logOut } from "@/redux/features/user/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import CircularLoading from "../common/circular-loading/CircularLoading";

const Home = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userObj = {
          id: user?.uid,
          displayName: user?.displayName,
          email: user?.email,
          photoUrl: user?.photoURL,
          accessToken: await user?.getIdToken(),
          refreshToken: user?.refreshToken,
        };
        setLoading(false);
        setLoggedInUser(userObj);
        dispatch(logIn(userObj));
      } else {
        setLoading(false);
        setLoggedInUser(null);
        dispatch(logOut());
      }
    });
  }, []);

  return (
    <div className="w-full max-h-screen h-screen mx-auto">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <CircularLoading size="3.5rem" thickness={4} />
        </div>
      ) : loggedInUser ? (
        <ChatRoomContainer />
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Home;
