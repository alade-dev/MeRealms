import { Routes, Route } from "react-router-dom";
import Index from "./pages/Landing/IndexPage";

// import ProtectedRoute from "./protectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />

      
    </Routes>
  );
}
