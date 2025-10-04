import React, { useEffect, useState } from 'react';

export default function NYSkylineSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50/30 via-blue-50/50 to-blue-10/40 pb-0 -mb-1">
      {/* Floating clouds for ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-[10%] w-32 md:w-48 h-12 md:h-16 bg-blue-100/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-16 right-[15%] w-40 md:w-56 h-14 md:h-20 bg-blue-100/20 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-12 left-[60%] w-36 md:w-52 h-12 md:h-18 bg-blue-100/25 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      {/* Skyline container - full width */}
      <div className="relative w-full px-0">
        {/* NYC Skyline silhouette - spanning full width with animations */}
        <div className="relative h-40 md:h-56 lg:h-72 flex items-end justify-between w-full gap-0">
          {/* Far Left Buildings */}
          <div className={`w-12 md:w-16 lg:w-24 bg-gradient-to-t from-blue-400/70 to-blue-300/60 shadow-lg transition-all duration-1000 ${isVisible ? 'h-20 md:h-28 lg:h-36 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '0ms' }}></div>
          
          <div className={`w-16 md:w-20 lg:w-28 bg-gradient-to-t from-blue-500/70 to-blue-400/60 shadow-lg transition-all duration-1000 ${isVisible ? 'h-28 md:h-36 lg:h-48 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
            <div className="grid grid-cols-3 gap-0.5 md:gap-1 p-1 md:p-2 opacity-60">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/50 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          <div className={`w-10 md:w-14 lg:w-20 bg-gradient-to-t from-blue-400/60 to-blue-300/50 shadow-md transition-all duration-1000 ${isVisible ? 'h-16 md:h-24 lg:h-32 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '200ms' }}></div>
          
          <div className={`w-14 md:w-20 lg:w-28 bg-gradient-to-t from-blue-600/75 to-blue-500/65 shadow-xl transition-all duration-1000 ${isVisible ? 'h-32 md:h-44 lg:h-56 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
            <div className="grid grid-cols-3 gap-0.5 md:gap-1 p-1 md:p-2 opacity-60">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/60 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          {/* Left-Center Buildings */}
          <div className={`w-12 md:w-16 lg:w-24 bg-gradient-to-t from-blue-500/70 to-blue-400/60 shadow-lg transition-all duration-1000 ${isVisible ? 'h-24 md:h-32 lg:h-44 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '400ms' }}></div>
          
          <div className={`w-16 md:w-24 lg:w-32 bg-gradient-to-t from-blue-700/80 to-blue-600/70 shadow-2xl hover:scale-105 transition-all duration-1000 ${isVisible ? 'h-36 md:h-48 lg:h-60 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2 opacity-70">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/70 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          <div className={`w-10 md:w-16 lg:w-24 bg-gradient-to-t from-blue-500/70 to-blue-400/60 shadow-lg transition-all duration-1000 ${isVisible ? 'h-20 md:h-28 lg:h-40 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '600ms' }}></div>
          
          <div className={`w-14 md:w-20 lg:w-28 bg-gradient-to-t from-blue-600/75 to-blue-500/65 shadow-xl transition-all duration-1000 ${isVisible ? 'h-28 md:h-40 lg:h-52 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
            <div className="grid grid-cols-3 gap-0.5 md:gap-1 p-1 md:p-2 opacity-60">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/60 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          {/* Empire State Building (CENTER - tallest) */}
          <div className={`relative w-16 md:w-28 lg:w-36 bg-gradient-to-t from-blue-800/85 to-blue-700/75 shadow-2xl hover:scale-105 transition-all duration-1200 ${isVisible ? 'h-40 md:h-56 lg:h-72 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
            <div className="absolute -top-4 md:-top-6 lg:-top-8 left-1/2 -translate-x-1/2 w-4 md:w-6 lg:w-8 h-4 md:h-8 lg:h-12 bg-blue-600/80">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 md:w-2 h-2 md:h-4 lg:h-6 bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50"></div>
            </div>
            <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2 mt-3 md:mt-6 lg:mt-8 opacity-80">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/80 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          {/* Right-Center Buildings */}
          <div className={`w-14 md:w-20 lg:w-28 bg-gradient-to-t from-blue-700/80 to-blue-600/70 shadow-xl transition-all duration-1000 ${isVisible ? 'h-32 md:h-44 lg:h-56 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
            <div className="grid grid-cols-3 gap-0.5 md:gap-1 p-1 md:p-2 opacity-70">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/70 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          <div className={`w-10 md:w-16 lg:w-24 bg-gradient-to-t from-blue-600/75 to-blue-500/65 shadow-lg transition-all duration-1000 ${isVisible ? 'h-24 md:h-36 lg:h-48 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '600ms' }}></div>
          
          <div className={`w-16 md:w-24 lg:w-32 bg-gradient-to-t from-blue-700/80 to-blue-600/70 shadow-2xl hover:scale-105 transition-all duration-1000 ${isVisible ? 'h-36 md:h-48 lg:h-60 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <div className="grid grid-cols-4 gap-0.5 md:gap-1 p-1 md:p-2 opacity-70">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/70 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          <div className={`w-12 md:w-18 lg:w-26 bg-gradient-to-t from-blue-600/75 to-blue-500/65 shadow-xl transition-all duration-1000 ${isVisible ? 'h-28 md:h-40 lg:h-52 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '400ms' }}></div>
          
          {/* Far Right Buildings */}
          <div className={`w-14 md:w-20 lg:w-28 bg-gradient-to-t from-blue-700/80 to-blue-600/70 shadow-xl transition-all duration-1000 ${isVisible ? 'h-32 md:h-44 lg:h-56 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
            <div className="grid grid-cols-3 gap-0.5 md:gap-1 p-1 md:p-2 opacity-70">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="w-full h-1.5 md:h-2 lg:h-3 bg-blue-100/70 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          <div className={`w-10 md:w-14 lg:w-20 bg-gradient-to-t from-blue-500/70 to-blue-400/60 shadow-lg transition-all duration-1000 ${isVisible ? 'h-20 md:h-28 lg:h-40 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '200ms' }}></div>
          
          <div className={`w-16 md:w-20 lg:w-28 bg-gradient-to-t from-blue-600/75 to-blue-500/65 shadow-xl transition-all duration-1000 ${isVisible ? 'h-28 md:h-40 lg:h-52 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '100ms' }}></div>
          
          <div className={`w-12 md:w-16 lg:w-24 bg-gradient-to-t from-blue-500/70 to-blue-400/60 shadow-lg transition-all duration-1000 ${isVisible ? 'h-24 md:h-32 lg:h-44 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '50ms' }}></div>
          
          <div className={`w-16 md:w-20 lg:w-28 bg-gradient-to-t from-blue-400/70 to-blue-300/60 shadow-lg transition-all duration-1000 ${isVisible ? 'h-20 md:h-28 lg:h-36 opacity-100' : 'h-0 opacity-0'}`} style={{ transitionDelay: '0ms' }}></div>
        </div>
      </div>

      {/* Base gradient for smooth transition */}
      <div className="w-full h-8 md:h-12 bg-gradient-to-b from-blue-100/40 to-transparent"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(15px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 14s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 16s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}