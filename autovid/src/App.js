import { useLocation } from "react-router-dom";
import Navbar from "./navigation-bar/Navbar";
import ContactUs from "./pages/contact us/ContactUs";
import About from "./pages/about/About";
import Login from "./pages//login/Login";
import Services from "./pages/services/Services";
import Home from "./pages/Home/Home";
import Register from "./pages/login/Register";
import { Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PromptToVideo from "./pages/promt to video/PromptToVideo";
import ProtectedRoute from "../src/pages/login/ProtectedRoute";

const clientId =
  "117534362421-k51kiuvpnuljpeurcj0jk13uvm28j6gm.apps.googleusercontent.com";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/promt-to-video"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/promt-to-video"
          element={
            <ProtectedRoute>
              <PromptToVideo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
