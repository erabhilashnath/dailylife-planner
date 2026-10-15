import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import LiveClock from "../components/LiveClock";
import ThemeToggle from "../components/ThemeToggle";
import FullscreenToggle from "../components/FullscreenToggle";
import { fetchTodoCounts } from "../api";
import { toDateKey } from "../dateUtils";
import { useTheme } from "../useTheme";
import { useFullscreen } from "../useFullscreen";

export default function MonthPage() {
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const [isFullscreen, toggleFullscreen] = useFullscreen();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [countsByDate, setCountsByDate] = useState({});
  const [error, setError] = useState(null);

  const loadCounts = useCallback(async (y, m) => {
    const start = toDateKey(new Date(y, m - 1, 25));
    const end = toDateKey(new Date(y, m + 1, 7));
    try {
      const rows = await fetchTodoCounts(start, end);
      const map = {};
      for (const row of rows) map[row.date] = row.count;
      setCountsByDate(map);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadCounts(year, month);
  }, [year, month, loadCounts]);

  function changeMonth(delta) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  function handleSelectDate(date) {
    navigate(`/day/${toDateKey(date)}`);
  }

  return (
    <div className="app month-view">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <header className="app-header">
        <h1>Daily Life Planner</h1>
        <LiveClock />
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="app-main single">
        <Calendar
          year={year}
          month={month}
          countsByDate={countsByDate}
          onSelectDate={handleSelectDate}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          onToday={goToday}
        />
      </main>
    </div>
  );
}
