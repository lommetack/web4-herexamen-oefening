import { Outlet, useLoaderData } from "react-router";
import { AppHeader } from "../components/AppHeader.jsx";
import { BottomNav } from "../components/BottomNav.jsx";
import { getCurrentUserId } from "../services/auth.js";
import { getUser } from "../services/users.js";

/**
 * De layout-loader draait bij ELKE navigatie binnen deze layout.
 * Hij haalt de ingelogde gebruiker op zodat de AppHeader zijn avatar kan tonen.
 */
export async function clientLoader() {
  const currentUser = await getUser(await getCurrentUserId());
  return { currentUser };
}

export default function AppLayout() {
  const { currentUser } = useLoaderData();

  return (
    <div className="app">
      <AppHeader currentUser={currentUser} />
      <main className="app-content">
        {/* <Outlet /> is de plek waar het kind-scherm (feed, track, ...) getekend wordt */}
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
