import Navbar from "./navbar/Navbar";
import ContactUs from "./pages/contact us/ContactUs";
import About from "./pages/about/About";
import Login from "./pages//login/Login";
import Services from "./pages/services/Services";
import Home from "./pages/Home/Home";
import Register from "./pages/register/Register";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {" "}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/services" element={<Services />}></Route>
        <Route path="/contact-us" element={<ContactUs />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </>
  );
}

export default App;
