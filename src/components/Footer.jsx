import { useState, useRef } from "react";

const Footer = () => {
  const [animating, setAnimating] = useState(false);
  const imgRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  const triggerAnimation = () => {
    if (animating) return;
    setAnimating(true);
  };

  const onTransitionEnd = () => {
    setAnimating(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerAnimation();
    }
  };

  return (
    <footer className="bg-white dark:bg-[#1A1A1D] border-t-2 border-gray-200 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-sm">
        <button
          type="button"
          aria-label="Activate rey-dev logo animation"
          onClick={triggerAnimation}
          onTouchStart={triggerAnimation}
          onKeyDown={onKeyDown}
          className="group flex items-center gap-2 select-none"
        >
          <img
            ref={imgRef}
            src="/logo3.png"
            alt="rey-dev logo"
            onTransitionEnd={onTransitionEnd}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain"
            style={{
              borderRadius: "50%",
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.89))",
              transform: animating
                ? "scale(1.3) rotate(360deg)"
                : hovering
                ? "rotate(360deg)"
                : "rotate(0deg) scale(1)",
              transition: animating ? "transform 700ms ease" : "transform 400ms linear",
            }}
          />
          <span className="text-gray-800 dark:text-gray-100 font-semibold hover:opacity-90">
            rey-dev
          </span>
        </button>

        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <span>© {new Date().getFullYear()} POS App</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
