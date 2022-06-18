import {
  deleteDoc,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import { auth } from "../../config/firebase";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts",
    id
  );
  const [post] = useDocumentData(postRef);

  const handleSubmit = () => {
    console.log("lol");
  };

  return (
    <main onSubmit={handleSubmit}>
      {post && (
        <main>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.id}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Actions: </h3>
            <button type="submit" className="btn-green">
              Save
            </button>
            <button className="btn-blue" onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Show Content"}
            </button>
            <DeletePostButton postRef={postRef} />
          </aside>
        </main>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && <div className="card">{watch("content")}</div>}

      <div className={"preview ? hidden : controls"}>
        <textarea>l</textarea>

        <fieldset>
          <input
            className={"styles.checkbox"}
            name="published"
            type="checkbox"
          />
          <label>Published</label>
        </fieldset>
        {/* disabled={!isDirty} */}
        <button type="submit" className="btn-green">
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("are you sure!");
    if (doIt) {
      await deleteDoc(postRef);
      router.push("/admin");
      toast("#NGMI ", { icon: "🗑️" });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}
