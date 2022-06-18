import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";

import { getUserWithUsername, postToJSON } from "../../config/firebase";

import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, "posts"),
      where("published", "==", true),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
