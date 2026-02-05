
import React, { useState, useRef, useEffect } from 'react';

interface OverviewProps {
  heroImage: string;
  setHeroImage: (url: string) => void;
  onStartPlanning: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const Overview: React.FC<OverviewProps> = ({ heroImage, setHeroImage, onStartPlanning }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation loop for heart splash
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12,
            opacity: p.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles]);

  const splashHearts = () => {
    const newParticles: Particle[] = [];
    const originX = 202; // Center of 404
    const originY = 120; // Top heart position

    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: Math.random(),
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 5 - 2,
        size: Math.random() * 12 + 6,
        opacity: 1,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeroImage(url);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-4 animate-in fade-in duration-700 bg-[#fafaf9]">
      {/* Image Section - Completely Seamless with #fafaf9 */}
      <section className="flex flex-col items-center pt-10">
        <div 
          className="relative bg-[#fafaf9] overflow-hidden flex items-center justify-center cursor-default group"
          style={{ width: '404px', height: '460px' }}
        >
          {/* Particles Overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute text-red-500 select-none pointer-events-none"
                style={{
                  left: p.x,
                  top: p.y,
                  fontSize: `${p.size}px`,
                  opacity: p.opacity,
                  transform: `translate(-50%, -50%) rotate(${p.vx * 20}deg)`,
                }}
              >
                ❤️
              </div>
            ))}
          </div>

          {/* Hero Image - No borders or shadows */}
          <img 
            src={heroImage} 
            alt="Modena Pixel Art" 
            className="w-full h-full object-contain pixelated pointer-events-none z-10"
          />

          {/* Invisible Heart Splash Zone */}
          <div 
            onMouseEnter={splashHearts}
            onTouchStart={(e) => { e.preventDefault(); splashHearts(); }}
            className="absolute top-[40px] left-[122px] w-[160px] h-[150px] cursor-pointer z-20 rounded-full"
          >
            {/* Minimal interaction hint */}
            <div className="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-500" />
          </div>

          {/* Update Control - Visible on hover */}
          <div className="absolute bottom-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-stone-900/10 backdrop-blur text-[10px] font-bold px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              Update Image
            </button>
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full p-12 md:p-20 flex flex-col items-center text-center bg-[#fafaf9]">
          <h1 className="text-[72px] text-red-600 mb-4 leading-none font-bold">
            hello love.
          </h1>
          <p className="text-[20px] text-stone-400 mb-10 tracking-[0.2em] uppercase font-bold">
            Welcome to Modena love
          </p>
          
          <div className="h-[3px] w-[60px] bg-red-600 mb-16"></div>
          
          <div className="max-w-[900px] space-y-12">
            <p className="text-[34px] text-stone-800 leading-[1.4] font-medium italic">
              "Once this city was in a big competition with your city, Bologna. Modena succeded in winning over Bologna. like how I won you."
            </p>
            
            <p className="text-[18px] text-stone-500 leading-relaxed font-light max-w-[700px] mx-auto">
              This space is for us. A plan to walk the same cobblestones that witnessed centuries of history, from the roar of the engines to the quiet patience of the balsamic attics.
            </p>
          </div>

          <button 
            onClick={onStartPlanning}
            className="mt-20 bg-stone-900 hover:bg-red-600 text-white px-20 py-7 rounded-2xl font-bold text-lg uppercase tracking-[5px] transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Open Our Planner
          </button>
        </div>
      </section>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6 pb-20 px-4 bg-[#fafaf9]">
        <HighlightCard 
          emoji="🏎️"
          title="Encyclopedia"
          desc="The technical soul and fiery passion of the motor valley, shared with you."
        />
        <HighlightCard 
          emoji="🍯"
          title="Aceto Oro"
          desc="Liquid gold aging in the dark, becoming sweeter with every passing year."
        />
        <HighlightCard 
          emoji="⛪"
          title="Ghirlandina"
          desc="The tower that stands tall, a symbol of the city that won its heart's desire."
        />
      </div>
    </div>
  );
};

const HighlightCard = ({ emoji, title, desc }: { emoji: string; title: string; desc: string }) => (
  <div className="bg-white p-8 rounded-3xl border border-stone-100 hover:border-red-600 transition-all group shadow-sm hover:shadow-lg">
    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">{emoji}</div>
    <h3 className="text-xl font-bold mb-3 text-stone-900">{title}</h3>
    <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Overview;
