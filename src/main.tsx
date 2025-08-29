import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "@/app/router";
import "@/styles/globals.css";

import { ThemeProvider } from "@/theme/ThemeProvider";
import { registerFeature as registerSorting } from "@/features/sorting";

registerSorting();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </React.StrictMode>
);
