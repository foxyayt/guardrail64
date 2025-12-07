
import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  color: string;
}

export const Gauge: React.FC<GaugeProps> = ({ value, max, label, color }) => {
  // SVG Arc Math
  const radius = 85;
  const stroke = 10;
  const normalizedValue = Math.min(Math.max(value, 0), max);
  // Calculate percentage (0 to 1)
  const percentage = normalizedValue / max;
  
  // Dash calculation for a 240 degree arc (leaving bottom open)
  // Circumference = 2 * PI * r = ~534
  // We want 240 degrees (2/3 of circle) = ~356 length
  const arcLength = 2 * Math.PI * radius * (240 / 360);
  const dashOffset = arcLength - (arcLength * percentage);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
       <svg viewBox="0 0 240 240" className="w-full h-full max-w-[300px]">
            <defs>
                <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
            </defs>

            {/* Background Track (240 degrees, rotated to start at 150) */}
            <circle 
                cx="120" cy="120" r={radius} 
                fill="none" 
                stroke="#1e293b" 
                strokeWidth={stroke} 
                strokeLinecap="round"
                strokeDasharray={`${arcLength} 1000`}
                transform="rotate(150 120 120)"
            />

            {/* Active Progress */}
            <circle 
                cx="120" cy="120" r={radius} 
                fill="none" 
                stroke={`url(#grad-${label})`} 
                strokeWidth={stroke} 
                strokeLinecap="round"
                strokeDasharray={`${arcLength} 1000`}
                strokeDashoffset={dashOffset}
                transform="rotate(150 120 120)"
                className="transition-all duration-300 ease-out"
            />
       </svg>

       {/* Center Text */}
       <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className="text-5xl md:text-6xl font-black text-white font-mono tracking-tighter tabular-nums">
                {value.toFixed(0)}
            </span>
            <span className="text-sm font-bold uppercase tracking-widest mt-2" style={{ color }}>
                {label}
            </span>
       </div>
    </div>
  );
};
