
import React, { useState } from 'react';
import { TabType } from './types';
import Overview from './components/Overview';
import Planner from './components/Planner';
import Experiences from './components/Experiences';
import Guide from './components/Guide';

// A built-in Base64 SVG fallback so the user never sees a broken image '?' icon.
// This SVG has the background color #fafaf9 and a heart in the center.
const DEFAULT_HERO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDQiIGhlaWdodD0iNDYwIiB2aWV3Qm94PSIwIDAgNDA0IDQ2MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZhZmFmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKdpO+4jzwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjcwJSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzQ0NCI+Q2xpY2sgJ1VwZGF0ZScgdG8gYWRkIHlvdXIgYXJ0PC90ZXh0Pjwvc3ZnPg==";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);
  // Persisting the image state here ensures it survives tab navigation
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO);

  const tabs = [
    { id: TabType.OVERVIEW, label: 'Discover', icon: '🏛️' },
    { id: TabType.PLANNER, label: 'Smart Planner', icon: '📅' },
    { id: TabType.EXPERIENCES, label: 'Experiences', icon: '🏎️' },
    { id: TabType.GUIDE, label: 'Travel Guide', icon: '🍷' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-['Pixelify_Sans'] bg-[#fafaf9]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-[100px] flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              <span className="text-[32px] font-bold text-red-600 leading-none">
                hello love.
              </span>
              <span className="text-[28px] animate-pulse">💚</span>
            </div>
            <span className="text-[18px] text-stone-500 mt-2">
              Welcome to Modena love
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[14px] font-bold tracking-widest uppercase transition-colors ${
                  activeTab === tab.id ? 'text-red-600' : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-8">
        {activeTab === TabType.OVERVIEW && (
          <Overview 
            heroImage={heroImage} 
            setHeroImage={setHeroImage} 
            onStartPlanning={() => setActiveTab(TabType.PLANNER)} 
          />
        )}
        {activeTab === TabType.PLANNER && <Planner />}
        {activeTab === TabType.EXPERIENCES && <Experiences />}
        {activeTab === TabType.GUIDE && <Guide />}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around py-4 z-50 px-2 shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center space-y-1"
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className={`text-[11px] uppercase font-bold tracking-tighter ${
              activeTab === tab.id ? 'text-red-600' : 'text-stone-400'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="hidden md:block py-12 bg-stone-900 text-stone-400">
        <div className="max-w-[1200px] mx-auto px-4 text-center text-[14px]">
          <p>Made for Michele • hello love. 💚</p>
        </div>
      </footer>
      
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default App;
