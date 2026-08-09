import { Outlet } from "react-router-dom";
import "./App.css";
import BottomNav from "./components/bottomNav/BottomNav";

function App() {
  return (
    <div className="app">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default App;
