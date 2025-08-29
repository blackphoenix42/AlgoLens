import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "react-router-dom";
import HomePage from "@/pages/HomePage";
import VisualizerPage from "@/pages/VisualizerPage";

/** Used ONLY as errorElement (has access to useRouteError) */
function ErrorBoundary() {
  const err = useRouteError();
  const isResp = isRouteErrorResponse(err);
  const status = isResp ? err.status : 500;
  const statusText = isResp ? err.statusText : "Unexpected Error";
  const msg =
    !isResp && err && typeof err === "object" && "message" in err
      ? (err as any).message
      : null;

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-lg w-full border rounded-xl p-6 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-2">
          {status} — {statusText}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          {msg || "Something went wrong while rendering this page."}
        </p>
        <div className="flex gap-2">
          <Link
            to="/"
            className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
          >
            ← Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

/** Use this for the 404 route (NO useRouteError here) */
function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-lg w-full border rounded-xl p-6 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-2">404 — Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          We couldn’t find that page.
        </p>
        <Link
          to="/"
          className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <HomePage />, errorElement: <ErrorBoundary /> },
  {
    path: "/viz/:topic/:slug",
    element: <VisualizerPage />,
    errorElement: <ErrorBoundary />,
  },
  // Catch-all 404 (must NOT use useRouteError)
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
