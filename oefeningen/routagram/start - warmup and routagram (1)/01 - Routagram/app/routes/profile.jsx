import { Button } from "react-aria-components";
import Avatar from "../components/Avatar";

export const clientLoader = async () => {
  // In a real app, this would fetch user profile data from a backend
  const user = {
    username: "username",
    avatar: "U",
    posts: 24,
    followers: 348,
    following: 211,
    name: "User Name",
    bio: "This is my bio. I love photography and travel.",
  };

  // Generate array of image IDs for the profile grid
  const postIds = Array.from({ length: 9 }, (_, i) => 200 + i);

  return { user, postIds };
};

export default function Profile() {
  const user = [];
  const postIds = [];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Avatar className="profile-avatar">{user.avatar}</Avatar>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{user.posts}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="profile-info">
        <h3 className="profile-name">{user.name}</h3>
        <p className="profile-bio">{user.bio}</p>
        <Button className="edit-profile-button">Edit Profile</Button>
      </div>

      <div className="profile-grid">
        {postIds.map((id) => (
          <div key={id} className="profile-post">
            <img
              src={`https://picsum.photos/seed/${id}/300/300`}
              alt={`Post ${id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
