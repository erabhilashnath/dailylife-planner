import { useState, useEffect, useCallback } from "react";

function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    null
  );
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(!!getFullscreenElement());

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(!!getFullscreenElement());
    }
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    document.addEventListener("MSFullscreenChange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
      document.removeEventListener("MSFullscreenChange", handleChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (getFullscreenElement()) {
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      exit && exit.call(document);
    } else {
      const el = document.documentElement;
      const request =
        el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      request && request.call(el);
    }
  }, []);

  return [isFullscreen, toggleFullscreen];
}
