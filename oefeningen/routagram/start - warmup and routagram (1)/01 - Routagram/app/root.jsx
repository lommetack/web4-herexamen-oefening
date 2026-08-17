import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";

import { Heart, Home, PlusSquare, Search, User } from "lucide-react";

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">Routagram</h1>
          </header>

          <main className="main-content">{children}</main>

          <nav className="bottom-nav">
            <a href="/" className="nav-item">
              <Home size={24} />
            </a>
            <a href="/explore" className="nav-item">
              <Search size={24} />
            </a>
            <a href="/create" className="nav-item">
              <PlusSquare size={24} />
            </a>
            <a href="/activity" className="nav-item">
              <Heart size={24} />
            </a>
            <a href="/profile" className="nav-item">
              <User size={24} />
            </a>
          </nav>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
