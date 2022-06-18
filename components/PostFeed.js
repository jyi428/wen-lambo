import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => <PostItem post={post} key={post.id} admin={admin} />)
    : null;
}

function PostItem({ post, admin = false }) {
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.id}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>{post.content}</span>
        <span>{post.published}</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.id}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>
          {post.published ? (
            <p className="text-success">LIVE</p>
          ) : (
            <p className="text-danger">NOT LIVE</p>
          )}
        </>
      )}
    </div>
  );
}
