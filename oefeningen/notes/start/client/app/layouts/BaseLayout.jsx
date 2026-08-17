import { Sidebar } from "../components/Sidebar";

const BaseLayout = () => {
  const { folders } = { folders: [] };

  const darkMode = false;

  return (
    <div className={`app ${darkMode ? "app--dark" : ""}`}>
      <Sidebar darkMode={darkMode} folders={folders} />
      {/* TODO: There needs to be something here... */}
    </div>
  );
};

export default BaseLayout;
