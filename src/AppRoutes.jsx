import { Routes, Route } from "react-router-dom";
import Index from "./pages/Landing/IndexPage";
import IndexPage from "./pages/Profile/IndexPage";
import MemeDetailPage from "./pages/meme/MemeDetailPage";
import LeaderboardPage from "./pages/LeaderBoard/LeaderBoard";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/profile/:id" element={<IndexPage />} />
      <Route path="/meme/:id" element={<MemeDetailPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      
    </Routes>
  );
}
