import { useCallback, useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'sysitadmin-theme';

/**
 * Resolve the theme to use, in priority order:
 *   1. an explicit choice the visitor made (persisted)
 *   2. their OS preference
 *   3. dark, which is the designed-for default
 */
function resolveTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

/**
 * Matches the inline script in index.html, which has already set the
 * attribute before first paint. This only keeps React in sync afterwards.
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  // Fire on the next frame so CSS custom properties have settled and the
  // canvas can re-read --canvas-bg.
  requestAnimationFrame(() => {
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  });
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    const resolved = resolveTheme();
    setTheme(resolved);
    setExplicit(
      window.localStorage.getItem(STORAGE_KEY) === resolved,
    );
    applyTheme(resolved);
  }, []);

  // Follow the OS for as long as the visitor has not chosen for themselves.
  useEffect(() => {
    if (explicit) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      const next: Theme = e.matches ? 'light' : 'dark';
      setTheme(next);
      applyTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [explicit]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(STORAGE_KEY, next);
      setExplicit(true);
      applyTheme(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setExplicit(false);
    const resolved = resolveTheme();
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  return { theme, toggle, reset, isExplicit: explicit };
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const label =
    theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="group fixed bottom-6 left-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-hairline bg-elev-hover text-fg backdrop-blur-xl transition-colors hover:border-accent"
    >
      {/* Both icons are always mounted and cross-faded, so the swap does
          not shift layout or pop. */}
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-50 opacity-0'
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          theme === 'light'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-50 opacity-0'
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export { Monitor };
