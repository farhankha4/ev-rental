"use client";

// ─── ScrollReveal Component ────────────────────────────────────────────────
//
// Automatically triggers fade-in-up animation when an element enters the viewport
// as the user scrolls down the page.
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of element is visible
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${className} ${
        isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
      } transition-all duration-700 ease-out`}
    >
      {children}
    </div>
  );
}
