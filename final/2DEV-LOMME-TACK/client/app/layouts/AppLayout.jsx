import { Outlet, useLoaderData } from "react-router";
import { AppHeader } from "../components/AppHeader.jsx";
import { BottomNav } from "../components/BottomNav.jsx";
import { getUser } from "../services/users.js";
import { getCurrentUserId } from "../services/auth.js";

export async function clientLoader() {
  const currentUserId = await getCurrentUserId();
  const currentUser = await getUser(currentUserId);
  return { currentUser };
}

export default function AppLayout() {
  const { currentUser } = useLoaderData();

  return (
    <div className="app">
      <AppHeader currentUser={currentUser} />
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
