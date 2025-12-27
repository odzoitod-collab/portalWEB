import React from 'react';
import { Store, Gift, Sparkles, User as UserIcon } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.STORE, label: 'Маркет', icon: Store },
    { id: ViewState.GIFTS, label: 'Подарки', icon: Gift },
    { id: ViewState.SEASON, label: 'Сезон', icon: Sparkles },
    { id: ViewState.PROFILE, label: 'Профиль', icon: UserIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e]/95 backdrop-blur-lg border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-tg-button' : 'text-tg-hint'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;