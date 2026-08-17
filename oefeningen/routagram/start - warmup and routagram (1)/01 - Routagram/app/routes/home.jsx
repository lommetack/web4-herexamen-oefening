import { Heart } from "lucide-react";
import { Button } from "react-aria-components";
import Avatar from "../components/Avatar";

export const clientLoader = async () => {
  // In a real app, this would fetch data from a backend
  const posts = [
    {
      id: 1,
      user: "user1",
      avatar: "U1",
      caption: "Beautiful day!",
      likes: 120,
    },
    {
      id: 2,
      user: "traveler",
      avatar: "T",
      caption: "Adventure time in the mountains",
      likes: 254,
    },
    {
      id: 3,
      user: "foodie",
      avatar: "F",
      caption: "Delicious brunch at my favorite spot",
      likes: 98,
    },
  ];

  return { posts };
};

const Home = () => {
  const posts = [];

  return (
    <div className="feed">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <Avatar className="post-avatar">{post.avatar}</Avatar>
            <span className="post-username">{post.user}</span>
          </div>

          <div className="post-image">
            <img
              src={`https://picsum.photos/seed/${post.id}/600/600`}
              alt="Post"
            />
          </div>

          <div className="post-content">
            <div className="post-actions">
              <Button aria-label="Like post" className="like-button">
                <Heart />
              </Button>
              <span className="post-likes">{post.likes} likes</span>
            </div>
            <p className="post-caption">
              <strong>{post.user}</strong> {post.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
