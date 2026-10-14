import { useState, useEffect } from "react";
import FlipDigit from "./FlipDigit";

function pad2(n) {
  return String(n).padStart(2, "0");
}

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = pad2(now.getHours());
  const m = pad2(now.getMinutes());
  const s = pad2(now.getSeconds());

  return (
    <div className="live-clock" aria-label={`Current time ${h}:${m}:${s}`}>
      <div className="flip-group">
        <FlipDigit digit={h[0]} />
        <FlipDigit digit={h[1]} />
      </div>
      <span className="flip-colon">:</span>
      <div className="flip-group">
        <FlipDigit digit={m[0]} />
        <FlipDigit digit={m[1]} />
      </div>
      <span className="flip-colon">:</span>
      <div className="flip-group">
        <FlipDigit digit={s[0]} />
        <FlipDigit digit={s[1]} />
      </div>
    </div>
  );
}
