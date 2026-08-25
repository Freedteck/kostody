import { Outlet } from "react-router-dom";
import AppScaffold from "./ui/AppScaffold";

const NAV = [
  { to: "/c/dashboard", icon: "home", label: "Active" },
  { to: "/c/history", icon: "history", label: "History" },
  { to: "/c/profile", icon: "person", label: "Profile" },
];

function CustomerApp() {
  return (
    <AppScaffold nav={NAV}>
      <Outlet />
    </AppScaffold>
  );
}

export default CustomerApp;
