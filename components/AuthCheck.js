import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link href="/login">You must be signed in</Link>;
}
