
import React, { useState, useRef } from 'react';
import { Experience } from '../types';

const INITIAL_EXPERIENCES: Experience[] = [
  { id: '1', title: 'The Enzo Ferrari Museum', category: 'Auto', description: 'Experience the futuristic yellow aluminum canopy designed by Jan Kaplický.', notes: '' },
  { id: '2', title: 'Albinelli Market', category: 'Food', description: 'Visit the historic covered market where locals shop for Parmigiano Reggiano.', notes: '' },
  { id: '3', title: 'Duomo di Modena', category: 'History', description: 'A UNESCO World Heritage site and a masterpiece of Romanesque architecture.', notes: '' },
  { id: '4', title: 'Traditional Acetaia', category: 'Food', description: 'Climb into the attics to smell the aging balsamic in cherry and oak barrels.', notes: '' }
];

const Experiences: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, imageUrl: url } : exp));
    }
  };

  const updateNotes = (id: string, newNotes: string) => {
    setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, notes: newNotes } : exp));
  };

  const triggerUpload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Don't open the detail page when clicking the upload button
    fileInputRefs.current[id]?.click();
  };

  const selectedExp = experiences.find(e => e.id === selectedId);

  // Detail View Component
  if (selectedExp) {
    return (
      <div className="max-w-[800px] mx-auto animate-in slide-in-from-right-4 duration-500 font-['Pixelify_Sans'] pb-20">
        <button 
          onClick={() => setSelectedId(null)}
          className="mb-8 flex items-center gap-2 text-stone-500 hover:text-red-600 transition-colors font-bold uppercase tracking-widest text-sm"
        >
          ← Back to Gallery
        </button>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-stone-200">
          <div className="h-[400px] relative">
            {selectedExp.imageUrl ? (
              <img src={selectedExp.imageUrl} className="w-full h-full object-cover" alt={selectedExp.title} />
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                <span className="text-6xl">📷</span>
              </div>
            )}
          </div>
          
          <div className="p-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">{selectedExp.category}</span>
              <h2 className="text-4xl font-bold text-stone-900">{selectedExp.title}</h2>
            </div>
            
            <p className="text-stone-500 text-lg mb-12 italic border-l-4 border-red-200 pl-6">
              {selectedExp.description}
            </p>

            <div className="space-y-6">
              <label className="block text-sm font-bold text-stone-400 uppercase tracking-[2px]">
                Your Definition / Notes for Michele 💚
              </label>
              <textarea
                value={selectedExp.notes || ''}
                onChange={(e) => updateNotes(selectedExp.id, e.target.value)}
                placeholder="Write something special here about this place..."
                className="w-full h-[300px] p-8 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-red-600 outline-none text-lg leading-relaxed text-stone-700 transition-all resize-none shadow-inner"
              />
            </div>

            <button 
              onClick={() => setSelectedId(null)}
              className="mt-12 w-full bg-red-600 hover:bg-stone-900 text-white py-6 rounded-2xl font-bold text-xl transition-all shadow-xl uppercase tracking-widest"
            >
              Save Definition
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-[48px] font-['Pixelify_Sans'] pb-[60px]">
      <div className="text-center max-w-[700px] mx-auto">
        <h2 className="text-[42px] font-bold mb-[16px]">Michele's Gallery 💚</h2>
        <p className="text-stone-500 text-[18px]">Click any experience to add your own definition or notes. Upload photos from your laptop to customize the wall.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-[32px]">
        {experiences.map((exp) => (
          <div 
            key={exp.id} 
            onClick={() => setSelectedId(exp.id)}
            className="bg-white rounded-[24px] overflow-hidden shadow-lg border border-stone-200 flex flex-col group cursor-pointer hover:border-red-600 transition-all transform hover:-translate-y-2"
          >
            <div className="relative h-[400px] bg-stone-100 overflow-hidden">
              {exp.imageUrl ? (
                <img src={exp.imageUrl} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-[40px] text-center">
                  <span className="text-[64px] mb-[24px]">📷</span>
                  <p className="text-stone-400 mb-[24px]">No photo selected</p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                <input 
                  type="file" 
                  ref={el => { fileInputRefs.current[exp.id] = el; }}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(exp.id, e)}
                />
                <button 
                  onClick={(e) => triggerUpload(e, exp.id)}
                  className="bg-white text-stone-900 px-[24px] py-[12px] rounded-xl font-bold shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
                >
                  Change Photo
                </button>
                <span className="text-white font-bold uppercase tracking-widest text-xs">Click to Edit Notes</span>
              </div>

              <div className="absolute top-[20px] left-[20px] bg-white border border-stone-200 px-[16px] py-[6px] rounded-xl text-[12px] font-bold text-stone-900 uppercase">
                {exp.category}
              </div>
            </div>
            
            <div className="p-[32px] bg-white">
              <h3 className="text-[28px] font-bold mb-[12px] text-red-600 flex items-center justify-between">
                {exp.title}
                {exp.notes && <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Written ✓</span>}
              </h3>
              <p className="text-stone-500 text-[16px] leading-[1.6] line-clamp-2">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
