// components/AnimatedText.jsx
"use client";

import { useEffect, useRef, useState } from 'react';

export default function AnimatedText({ 
  children, 
  className = "", 
  delay = 0,
  direction = "left" // "left", "right", "up", "down"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, mounted]);

  const getTransformClass = () => {
    if (!mounted) return ""; // Sem animação no servidor
    
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "translate-x-[-100px] opacity-0";
        case "right":
          return "translate-x-[100px] opacity-0";
        case "up":
          return "translate-y-[-50px] opacity-0";
        case "down":
          return "translate-y-[50px] opacity-0";
        default:
          return "translate-x-[-100px] opacity-0";
      }
    }
    return "translate-x-0 translate-y-0 opacity-100";
  };

  return (
    <div
      ref={ref}
      className={`${mounted ? 'transition-all duration-1000 ease-out' : ''} ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
}

