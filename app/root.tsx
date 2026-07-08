import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import tailwindStyles from "~/tailwind.css";
import { authenticator } from "~/services/auth.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindStyles },
];

export async function loader({ context }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(context.request, {
    failureRedirect: "/login",
  });
  
  return { user };
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full bg-gray-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-white">Cloud File Manager</h1>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Hello, {user.email}</span>
                  <a 
                    href="/logout" 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Logout
                  </a>
                </div>
              ) : (
                <div className="space-x-2">
                  <a 
                    href="/login" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Login
                  </a>
                  <a 
                    href="/signup" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </header>
          
          <main className="flex-grow">
            <Outlet />
          </main>
          
          <footer className="bg-gray-800 py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400">© 2026 Cloud File Manager</p>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
