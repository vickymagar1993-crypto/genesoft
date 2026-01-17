'use client';

import { useState, useEffect, useRef } from 'react';

const CountingNumber = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Extract number from string (e.g., "200+" -> 200, "98%" -> 98)
          const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
          const suffix = value.replace(/[0-9]/g, '');
          
          let startTime = null;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            
            // Easing function for smooth animation
            const easeOutQuad = (t) => t * (2 - t);
            const currentCount = Math.floor(numericValue * easeOutQuad(progress));
            
            setCount(currentCount + suffix);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration, hasAnimated]);

  return <span ref={ref}>{count || value}</span>;
};

export default CountingNumber;
