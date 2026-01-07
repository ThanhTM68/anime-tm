
import React, { useEffect, useState } from 'react';

const Particles: React.FC = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-pink-400/30 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `-5%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `fall ${p.duration}s linear infinite ${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(10vw) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Particles;
