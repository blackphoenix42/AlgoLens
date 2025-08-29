import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import VisualizerPage from "@/pages/VisualizerPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:topic/:algo" element={<VisualizerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
