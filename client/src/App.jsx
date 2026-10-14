import { Routes, Route } from "react-router-dom";
import MonthPage from "./pages/MonthPage";
import DayPage from "./pages/DayPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MonthPage />} />
      <Route path="/day/:date" element={<DayPage />} />
    </Routes>
  );
}

export default App;
