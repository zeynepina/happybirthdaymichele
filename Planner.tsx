import React, { useState } from 'react';
import { generateItinerary } from '../services/geminiService';
import { ItineraryDay } from '../types';

const Planner: React.FC = () => {
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>(['Food', 'Motors']);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);

  const interestOptions = ['Food', 'Motors', 'Opera', 'History', 'Art', 'Shopping'];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateItinerary(days, interests);
      setItinerary(result.days);
    } catch (error) {
      alert("Failed to generate itinerary. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-in slide-in-from-bottom-4 duration-500 font-['Pixelify_Sans']">
      <div className="bg-white p-[48px] rounded-[32px] shadow-xl border border-stone-100 mb-[48px]">
        <h2 className="text-[36px] font-bold mb-[32px] flex items-center">
          <span className="mr-4">✨</span> Birthday Trip Architect
        </h2>
        
        <div className="grid md:grid-cols-2 gap-[48px] mb-[48px]">
          <div>
            <label className="block text-[14px] font-bold text-stone-500 uppercase mb-[16px] tracking-widest">Duration</label>
            <div className="flex items-center space-x-6">
              <input 
                type="range" min="1" max="7" value={days} 
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full h-[8px] bg-stone-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <span className="text-[24px] font-bold text-red-600 min-w-[100px]">{days} Days</span>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-stone-500 uppercase mb-[16px] tracking-widest">Michele's Interests</label>
            <div className="flex flex-wrap gap-[12px]">
              {interestOptions.map(option => (
                <button
                  key={option}
                  onClick={() => toggleInterest(option)}
                  className={`px-[20px] py-[10px] rounded-xl text-[14px] font-bold transition-all border-2 ${
                    interests.includes(option)
                      ? 'bg-red-600 border-red-600 text-white shadow-lg'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-red-600 hover:text-red-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-[24px] rounded-[24px] font-bold text-[20px] shadow-2xl transition-all uppercase tracking-[4px] ${
            loading ? 'bg-stone-300 cursor-not-allowed text-stone-500' : 'bg-stone-900 hover:bg-red-600 text-white transform hover:scale-[1.02]'
          }`}
        >
          {loading ? 'Creating Your Perfect Days...' : 'Generate Birthday Itinerary'}
        </button>
      </div>

      {itinerary && (
        <div className="space-y-[48px] animate-in fade-in zoom-in-95 duration-500 pb-[100px]">
          {itinerary.map((day) => (
            <div key={day.day} className="bg-white rounded-[32px] p-[48px] shadow-lg border border-stone-100">
              <div className="flex items-center justify-between mb-[40px]">
                <h3 className="text-[32px] font-bold">Day {day.day}: {day.title}</h3>
                <span className="bg-red-100 px-[16px] py-[8px] rounded-xl text-[12px] font-bold text-red-600 tracking-widest uppercase">Special Selection</span>
              </div>
              <div className="space-y-[32px] relative border-l-4 border-red-50 ml-[16px] pl-[40px]">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[48px] top-[4px] w-[12px] h-[12px] rounded-full bg-red-600 border-4 border-white shadow-md ring-4 ring-red-50"></div>
                    <div className="text-[14px] font-bold text-red-600 mb-[8px] uppercase tracking-widest">{activity.time}</div>
                    <div className="font-bold text-[22px] mb-[8px] text-stone-900">{activity.location}</div>
                    <p className="text-stone-600 text-[16px] leading-relaxed font-light">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Planner;