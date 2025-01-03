import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import favicon from "/favicon.ico"

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col max-w-2xl mx-auto h-[100dvh] bg-gray-50">
          <Link to="/">
            <header className="bg-blue-600 text-white p-4 flex items-center space-x-4">
              <img src={favicon} className="h-8 w-8" alt="App Logo" />
              <span className="text-xl font-bold flex items-center">Alexandria</span>
            </header>
          </Link>
          <main className="flex-1 overflow-y-auto">
            {children}
            <ScrollRestoration />
            <Scripts />
          </main>
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
