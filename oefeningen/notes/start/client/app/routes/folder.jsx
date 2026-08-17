import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";

const FolderRoute = () => {
  const { activeFolder, notes } = { activeFolder: {}, notes: [] };

  return (
    <div className="app">
      <Sidebar notes={notes} activeFolder={activeFolder} />
      <div className="app__content">
        <Outlet />
      </div>
    </div>
  );
};

export default FolderRoute;
