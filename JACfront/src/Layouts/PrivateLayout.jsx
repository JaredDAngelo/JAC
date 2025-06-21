import Sidebar from "../Components/Sidebar"; // Tu Sidebar hecho
import { Outlet } from "react-router-dom";

function PrivateLayout() {
  return (
    <div className="private-layout">
        <Sidebar />
      <main className="private-content">
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;
