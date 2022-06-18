import {
  collection,
  doc,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { auth } from "../../config/firebase";
import { UserContext } from "../../contexts/UserContext";

import { useRouter } from "next/router";
import { useContext, useState } from "react";

import kebabCase from "lodash.kebabcase";
import { useCollection } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = collection(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts"
  );
  const postQuery = query(ref);

  const [querySnapshot] = useCollection(postQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Ensure slug is URL safe
  const id = encodeURI(kebabCase(title));

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), "users", uid, "posts", id);

    // Default Values
    const data = {
      title,
      id,
      uid,
      username,
      published: false,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, data);

    toast.success("Sumthing created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${id}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className={"input"}
      />

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Sum Stuff"
        className={"input"}
      />

      <button type="submit" className="btn-green">
        Add Random Stuff
      </button>
    </form>
  );
}
