import Link from "next/link";

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Made sumthing useless by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
      </span>
      {post?.content}
    </div>
  );
}
