import React from 'react';

const AnimatedBackground = () => {
  const colorPalette = [
    'bg-[#013968]/20',   // Deep blue
    'bg-[#fb8d34]/20',   // Avigna orange
    'bg-[#4a90e2]/20',   // Bright blue
    'bg-[#2c3e50]/20',   // Dark slate
    'bg-[#34495e]/20'    // Slightly lighter slate
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {[...Array(50)].map((_, index) => {
        // Randomize shape properties
        const size = Math.random() * 30 + 10; // 10-40px
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 15; // 15-35s
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4 opacity
        
        // Randomly choose shape type
        const shapeType = Math.random() > 0.5 ? 'circle' : 'rectangle';
        const colorClass = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        
        return (
          <div
            key={index}
            className={`absolute ${colorClass} border border-opacity-30 transform-gpu animate-float`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: opacity,
              borderRadius: shapeType === 'circle' ? '50%' : '0%',
              // Add slight rotation for more dynamic feel
              animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse'
            }}
          />
        );
      })}
    </div>
  );
};

export default AnimatedBackground;