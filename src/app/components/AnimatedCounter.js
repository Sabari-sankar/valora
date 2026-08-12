'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1000, formatter }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(null);
  const targetValueRef = useRef(value);

  useEffect(() => {
    startValueRef.current = displayValue;
    targetValueRef.current = value;
    startTimeRef.current = null;

    let animId;
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // easeOutCubic: f(t) = 1 - (1-t)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      
      const current = startValueRef.current + (targetValueRef.current - startValueRef.current) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValueRef.current);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  const formatted = formatter ? formatter(displayValue) : Math.round(displayValue).toLocaleString('en-IN');
  return <>{formatted}</>;
}
