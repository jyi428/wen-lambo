import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
} from "firebase/firestore";

import { getUserWithUsername, postToJSON } from "../../config/firebase";

import Link from "next/link";
import { useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

import PostContent from "../../components/PostContent";

import AuthCheck from "../../components/AuthCheck";

import { UserContext } from "../../contexts/UserContext";

export async function getStaticProps({ params }) {
  const { username, id } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, "posts", id);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const q = query(collectionGroup(getFirestore(), "posts"), limit(20));
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { id, username } = doc.data();
    return {
      params: { username, id },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, id }}
    // ],
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={"styles.container"}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <AuthCheck
          fallback={
            <Link href="/login">
              <button>🚀 Sign Up</button>
            </Link>
          }
        ></AuthCheck>

        {currentUser?.uid === post.uid ? (
          <Link href={`/admin/${post.id}`}>
            <button className="btn-blue">Edit</button>
          </Link>
        ) : (
          <h4>{`Login with user: ${post.username}`}</h4>
        )}
      </aside>
    </main>
  );
}
