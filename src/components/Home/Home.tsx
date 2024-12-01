import Login from "../login/Login";
import ChatRoomContainer from "../chat/ChatRoomContainer";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/app/hooks";
import { logIn, logOut } from "@/redux/features/user/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import CircularLoading from "../common/circular-loading/CircularLoading";
import { doc, getDoc } from "firebase/firestore";

const Home = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user?.uid);
          const userShapshot = await getDoc(userDocRef);
          if (userShapshot.exists()) {
            const user = userShapshot.data();
            setLoading(false);
            setLoggedInUser(user);
            dispatch(logIn(user));
          } else {
            setLoading(false);
            setLoggedInUser(null);
            dispatch(logOut());
          }
        } catch (ex) {
          setLoading(false);
          setLoggedInUser(null);
          dispatch(logOut());
        }
      } else {
        setLoading(false);
        setLoggedInUser(null);
        dispatch(logOut());
      }
    });

    return () => unSub();
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
