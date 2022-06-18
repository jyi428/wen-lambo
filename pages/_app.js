import { Toaster } from "react-hot-toast";
import NavBar from "../components/NavBar";
import { useUserData } from "../config/hooks";
import { UserContext } from "../contexts/UserContext";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <NavBar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
};

export default MyApp;
