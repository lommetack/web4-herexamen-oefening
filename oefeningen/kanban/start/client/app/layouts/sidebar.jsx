import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="drawer" data-testid="drawer">
      <div className="drawer__content">
        <a href={`/`} className="drawer__close">
          &times;
        </a>
        <div className="drawer__body">
          {/* TODO: there needs to be something here... */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
