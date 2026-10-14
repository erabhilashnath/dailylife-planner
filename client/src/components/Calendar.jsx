import {
  getMonthGrid,
  isSameDay,
  toDateKey,
  MONTH_NAMES,
  WEEKDAY_NAMES,
} from "../dateUtils";

export default function Calendar({
  year,
  month,
  countsByDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) {
  const days = getMonthGrid(year, month);
  const today = new Date();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={onPrevMonth} aria-label="Previous month">‹</button>
        <h2>
          {MONTH_NAMES[month]} {year}
        </h2>
        <button onClick={onNextMonth} aria-label="Next month">›</button>
        <button className="today-btn" onClick={onToday}>Today</button>
      </div>

      <div className="weekday-row">
        {WEEKDAY_NAMES.map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className="day-grid">
        {days.map((day) => {
          const inMonth = day.getMonth() === month;
          const key = toDateKey(day);
          const count = countsByDate[key] || 0;
          const isToday = isSameDay(day, today);

          return (
            <button
              key={key}
              className={[
                "day-cell",
                !inMonth && "outside",
                isToday && "today",
              ].filter(Boolean).join(" ")}
              onClick={() => onSelectDate(day)}
            >
              <span className="day-number">{day.getDate()}</span>
              {count > 0 && (
                <span className="event-dot-row">
                  <span className="event-dot" />
                  <span className="event-more">{count}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
