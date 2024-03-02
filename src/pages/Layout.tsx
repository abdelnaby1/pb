import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
