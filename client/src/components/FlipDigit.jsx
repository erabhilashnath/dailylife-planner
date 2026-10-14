import { useState, useEffect, useRef } from "react";

export default function FlipDigit({ digit }) {
  const [current, setCurrent] = useState(digit);
  const [next, setNext] = useState(null);
  const [animating, setAnimating] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (digit !== current && next === null) {
      setNext(digit);
      rafRef.current = requestAnimationFrame(() => setAnimating(true));
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [digit, current, next]);

  function handleTransitionEnd(e) {
    if (e.propertyName !== "transform" || next === null) return;
    setCurrent(next);
    setNext(null);
    setAnimating(false);
  }

  const backDigit = next !== null ? next : current;

  return (
    <div className="flip-digit">
      <div
        className={`flip-digit-inner ${animating ? "flipping" : ""}`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flip-face front">{current}</div>
        <div className="flip-face back">{backDigit}</div>
      </div>
    </div>
  );
}
