"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  padZero?: boolean;
  suffix?: string;
  className?: string;
  plusClassName?: string;
}

export function AnimatedCounter({
  value,
  duration = 1400,
  padZero = true,
  suffix = "+",
  className = "metric-number",
  plusClassName = "metric-number-plus",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setCount(value);
      setHasAnimated(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const startTime = performance.now();
          const startValue = 0;
          const endValue = value;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic curve: 1 - (1 - t)^3
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.round(startValue + (endValue - startValue) * easeOutCubic);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value, duration, hasAnimated]);

  const formattedCount = padZero
    ? String(count).padStart(2, "0")
    : String(count);

  return (
    <span ref={elementRef} className="metric-number-wrap">
      <span className={className}>{formattedCount}</span>
      {suffix && <span className={plusClassName}>{suffix}</span>}
    </span>
  );
}
