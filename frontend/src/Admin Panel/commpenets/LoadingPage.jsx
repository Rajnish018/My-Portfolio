import { useState, useEffect } from 'react';

const LoadingPage = ({ onComplete }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 15) + 5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2
    }));
    setParticles(initialParticles);
    
    // Animate particles continuously
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: (p.y + 5) % 100,
          x: p.x + (Math.random() - 0.5) * 2
        }))
      );
    }, 200);
    
    // Call onComplete after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white bg-opacity-20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `pulse ${particle.duration}s infinite ${particle.delay}s`,
              filter: `blur(${Math.min(particle.size / 5, 3)}px)`
            }}
          />
        ))}
      </div>

      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-pink-500 border-b-transparent rounded-full animate-spin-reverse"></div>
          <div className="absolute inset-8 bg-gradient-to-tr from-cyan-400 to-pink-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Text Animation */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 animate-bounce">
            Loading
            <span className="inline-block">
              {['.', '.', '.'].map((dot, i) => (
                <span 
                  key={i} 
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${0.5 + i * 0.3}s` }}
                >
                  {dot}
                </span>
              ))}
            </span>
          </h1>
          <p className="text-purple-200 font-light">Preparing your experience</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-10 w-80 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-progress"
        ></div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 0.3; }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes progress {
          0% { width: 5%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s ease-in-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s forwards;
        }
        @keyframes fade-in {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;