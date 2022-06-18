import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { auth } from "../config/firebase";
import { UserContext } from "../contexts/UserContext";
import LamboIcon from "./LamboIcon";

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <a>
              <LamboIcon />
            </a>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOutNow}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-green">Post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || "/hacker.png"} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/login">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
