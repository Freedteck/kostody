import { Outlet } from "react-router-dom";
import AppScaffold from "./ui/AppScaffold";

const NAV = [
  { to: "/app/dashboard", icon: "space_dashboard", label: "Jobs" },
  { to: "/app/history", icon: "history", label: "History" },
  { to: "/app/profile", icon: "person", label: "Profile" },
];

function App() {
  return (
    <AppScaffold nav={NAV}>
      <Outlet />
    </AppScaffold>
  );
}

export default App;
