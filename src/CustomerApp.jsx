import { Outlet } from "react-router-dom";
import "./App.css";
import CustomerBottomNav from "./components/customerBottomNav/CustomerBottomNav";

function CustomerApp() {
  return (
    <div className="app">
      <Outlet />
      <CustomerBottomNav />
    </div>
  );
}

export default CustomerApp;
