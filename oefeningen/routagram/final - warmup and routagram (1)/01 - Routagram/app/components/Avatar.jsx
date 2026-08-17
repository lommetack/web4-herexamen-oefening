// app/components/Avatar.jsx
import React from "react";

const Avatar = ({ children, className }) => {
  return (
    <div className={`avatar ${className || ""}`}>
      <div className="avatar-inner">{children}</div>
    </div>
  );
};

export default Avatar;
