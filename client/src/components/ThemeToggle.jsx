export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to night mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to night mode"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
