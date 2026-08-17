import Avatar from "../components/Avatar";

export const clientLoader = async () => {
  // In a real app, this would fetch activity data from a backend
  const activities = [
    {
      id: 1,
      user: "jane_doe",
      avatar: "JD",
      action: "liked your photo",
      time: "2h",
    },
    {
      id: 2,
      user: "photo_lover",
      avatar: "PL",
      action: "started following you",
      time: "5h",
    },
    {
      id: 3,
      user: "travel_guru",
      avatar: "TG",
      action: "commented on your post",
      time: "1d",
    },
  ];

  return { activities };
};

export default function Activity() {
  const activities = [];

  return (
    <div className="activity-page">
      <h2>Activity</h2>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <Avatar className="activity-avatar">{activity.avatar}</Avatar>
            <div className="activity-details">
              <span className="activity-username">{activity.user}</span>
              <span className="activity-action">{activity.action}</span>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
