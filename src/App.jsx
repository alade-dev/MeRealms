import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import NavBar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
        <ToastContainer position="top-center" />
        <NavBar />
        <AppRoutes />
        <Footer />
    </>
  );
}

export default App;
