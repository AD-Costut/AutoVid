import Navbar from "./Navbar/Navbar";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {" "}
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/services" element={<Services />}></Route>
          <Route path="/contact-us" element={<ContactUs />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
