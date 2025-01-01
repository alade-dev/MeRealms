import { useLocation } from "react-router-dom";
import AIAssistantWidget from "./components/AIAssistantWidget";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import NavBar from "./components/Navbar";

import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  const isMemeDetails = location.pathname.includes("/meme/");

  return (
    <>
      <ToastContainer position="top-center" />
      <NavBar />
      <AppRoutes />
      <AIAssistantWidget memeDetails={isMemeDetails ? {} : null} />
      <Footer />
    </>
  );
}

export default App;
