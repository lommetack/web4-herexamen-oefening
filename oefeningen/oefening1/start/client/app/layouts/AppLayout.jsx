import { Outlet } from "react-router";
import { AppHeader } from "../components/AppHeader.jsx";
import { BottomNav } from "../components/BottomNav.jsx";

export default function AppLayout() {
  const { currentUser } = {};

  return (
    <div className="app">
      <AppHeader currentUser={currentUser} />
      <main className="app-content">{/** something is missing here... */}</main>
      <BottomNav />
    </div>
  );
}
