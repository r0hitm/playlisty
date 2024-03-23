import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./Root.tsx";

import App from "./routes/App.tsx";
import About from "./routes/About.tsx";
import PrivacyPolicy from "./routes/PrivacyPolicy.tsx";
import Callback from "./routes/Callback.tsx";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />, // jsx or component to be rendered on this path
            //   errorPage: // component  to render when error (see below)
            children: [
                {
                    path: "/app",
                    element: <App />,
                },
                {
                    path: "/about",
                    element: <About />,
                },
                {
                    path: "/privacy-policy",
                    element: <PrivacyPolicy />,
                },
            ],
        },
        {
            path: "/callback",
            loader: ({ request }) => {
                console.log("callback");
                const url = new URL(request.url);
                const searchTerm = url.searchParams.get("code");
                return searchTerm !== null;
            },
            element: <Callback />,
        },
    ]
    // basename: "/<REPO>" // if not being deployed to root of the website
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* <Root /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
);
