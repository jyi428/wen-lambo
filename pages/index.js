import {
  collectionGroup,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import PostFeed from "../components/PostFeed";
import { postToJSON } from "../config/firebase";

import { useState } from "react";

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), "posts");
  const postsQuery = query(ref, where("published", "==", true));

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  return (
    <main>
      <h1>Mint Feed</h1>
      <PostFeed posts={posts} />
    </main>
  );
}
