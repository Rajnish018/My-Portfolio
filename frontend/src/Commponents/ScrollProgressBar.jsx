import { useEffect, useState } from "react";

/**
 * ScrollProgressBar
 * Grows from 0 → 100 % width and sits just **below** a fixed navbar.
 * -------------------------------------------------------------
 * Change the `top-16` class if your navbar height differs:
 *   - h-16 (4 rem / 64 px)  →  use top-16
 *   - h-20 (5 rem / 80 px)  →  use top-20
 */
const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const pct = total > 0 ? (scrollTop / total) * 100 : 0;
      setProgress(pct);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    // ↓↓↓  top-16 positions the bar 64 px below viewport top (under a h-16 navbar)
    <div className="pointer-events-none fixed inset-x-0 top-12 z-50 h-1 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-[width] duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
