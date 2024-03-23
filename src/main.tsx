import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Root } from "./Root.tsx";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />, // jsx or component to be rendered on this path
            //   errorPage: // component  to render when error (see below)
            //   children: [/* nested routes */], // to render use <Outlet /> in <Root />
        },
        {
            path: "/contact/:id", // dynacmic url
            // ....
        },
        // ... rest of the routes
    ]
    // basename: "/<REPO>" // if not being deployed to root of the website
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* <Root /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
);
