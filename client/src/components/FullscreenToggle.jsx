export default function FullscreenToggle({ isFullscreen, onToggle }) {
  return (
    <button
      type="button"
      className="fullscreen-toggle"
      onClick={onToggle}
      aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
      title={isFullscreen ? "Exit full screen" : "Enter full screen"}
    >
      ⛶
    </button>
  );
}
