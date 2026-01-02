import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const meta: Route.MetaFunction = ({ location }) => {
  const url = location.pathname; // Ideally absolute, but pathname is a start for now
  return [
    { title: "业余无线电可视化 (Ham Radio Visualization)" },
    {
      name: "description",
      content:
        "3D可视化演示各类（垂直、水平、圆极化等）天线电磁波传播原理。Interactive 3D visualization of amateur radio antenna polarization and propagation.",
    },
    { property: "og:site_name", content: "业余无线电可视化" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: "/og-image.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "/og-image.png" },
    { name: "twitter:title", content: "业余无线电可视化 (Ham Radio Visualization)" },
    { name: "twitter:description", content: "3D可视化演示各类（垂直、水平、圆极化等）天线电磁波传播原理。" },
    {
      name: "keywords",
      content:
        "业余无线电, 天线, 可视化, 3D, 电磁波, 传播, 极化, vertical polarization, horizontal polarization, circular polarization, yagi antenna, ham radio, amateur radio, visualization, propagation, polarization",
    },
  ];
};


export const links: Route.LinksFunction = () => [
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
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

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
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
