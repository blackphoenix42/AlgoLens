import { useTheme } from "@/theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm bg-white/80 dark:bg-slate-800/80 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
      title="Switch theme"
    >
      <span className="text-sm font-medium">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
      <span className="text-lg">{theme === "dark" ? "🌙" : "🌤️"}</span>
    </button>
  );
}
