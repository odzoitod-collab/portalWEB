import React, { useState } from 'react';
import { Sparkles, Trophy, Zap, ArrowRight, Clock, Star } from 'lucide-react';
import Header from './Header';
import SeasonCompetitionSheet from './SeasonCompetitionSheet';

interface SeasonViewProps {
  userBalance: number;
  onOpenWallet: () => void;
}

const SeasonView: React.FC<SeasonViewProps> = ({ userBalance, onOpenWallet }) => {
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);

  return (
    <div className="pb-24 animate-fade-in bg-black">
      <Header balance={userBalance} onOpenWallet={onOpenWallet} transparent />
      
      {/* Hero Section */}
      <div className="relative h-[480px] overflow-hidden rounded-b-[40px] shadow-2xl shadow-yellow-900/20 border-b border-white/5">
         {/* Backgrounds */}
         <div className="absolute inset-0 bg-[#0f0f0f] z-0"></div>
         <div className="absolute inset-0 bg-[url('https://storage.cryptomus.com/pAAqOeM9Dh75muVZJjSTHuhWwCjRWDJUOcMpvFTA.webp')] opacity-50 bg-cover bg-center mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
         
         {/* Particles */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-10 animate-pulse"></div>

         {/* Content */}
         <div className="relative z-20 flex flex-col items-center justify-end h-full pb-12 text-center px-6">
            
            <div className="animate-bounce mb-4">
                 <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(234,179,8,0.5)] border border-yellow-300/50 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 fill-black" /> Live Event
                </div>
            </div>
            
            <h1 className="text-7xl font-black text-white italic tracking-tighter mb-2 uppercase drop-shadow-2xl scale-y-110">
                Season <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600">II</span>
            </h1>
            
            <p className="text-gray-300 text-sm max-w-xs mx-auto leading-relaxed font-medium mb-8 opacity-80">
                Коллекция "Sandstorm". Получайте уникальные награды за активность в маркете.
            </p>

            <button 
                onClick={() => setIsCompetitionOpen(true)}
                className="w-full max-w-xs bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)] group"
            >
                Участвовать <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-white/50 bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" />
                <span>ЗАКАНЧИВАЕТСЯ ЧЕРЕЗ 12 ДНЕЙ</span>
            </div>
         </div>
      </div>

      {/* Info Cards */}
      <div className="px-4 -mt-6 relative z-30 grid grid-cols-2 gap-3">
          <InfoCard title="Призовой фонд" value="50K TON" icon={<Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />} />
          <InfoCard title="Участников" value="12,405" icon={<Zap className="w-6 h-6 text-blue-400 fill-blue-400/20" />} />
      </div>
      
      {/* Featured Item */}
      <div className="px-4 mt-8 mb-6">
          <div className="mb-4 px-1">
              <h3 className="text-2xl font-black text-white tracking-tight">Главный приз</h3>
          </div>
          
          <div className="bg-gradient-to-br from-[#1c1c1e] to-[#151517] rounded-[32px] p-6 border border-white/10 relative overflow-hidden group hover:border-yellow-500/40 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] transition-all duration-500 cursor-pointer">
              {/* Enhanced Glows */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/15 rounded-full blur-[60px] -mr-12 -mt-12 group-hover:bg-yellow-500/25 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/15 rounded-full blur-[50px] -ml-12 -mb-12 group-hover:bg-purple-500/25 transition-all duration-500"></div>
              
              {/* Animated particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-100"></div>
                  <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-200"></div>
              </div>
              
              <div className="flex items-center gap-6 relative z-10">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-500/20 rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 bg-gradient-to-br from-black to-gray-900">
                      <img src="https://picsum.photos/200/200?random=99" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                      <div className="text-yellow-500 font-black text-[11px] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                         <Star className="w-3.5 h-3.5 fill-yellow-500 animate-pulse" /> Legendary
                      </div>
                      <h4 className="text-3xl font-black text-white mb-4 leading-none tracking-tight">Golden<br/>Scarab</h4>
                      <div className="flex flex-col gap-2">
                          <div className="bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/40 text-yellow-200 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-yellow-900/20">
                              <Sparkles className="w-3.5 h-3.5" />
                              Шанс выпадения 0.01%
                          </div>
                          <div className="text-gray-400 text-xs font-medium">
                              Стоимость: <span className="text-white font-bold">25,000 TON</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Competition Sheet */}
      <SeasonCompetitionSheet 
        isOpen={isCompetitionOpen}
        onClose={() => setIsCompetitionOpen(false)}
      />
    </div>
  );
};

const InfoCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-[#1c1c1e]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-xl shadow-black/50">
        <div className="mb-2 p-3 bg-white/5 rounded-full ring-1 ring-white/5">{icon}</div>
        <div className="text-xl font-black text-white tracking-tight">{value}</div>
        <div className="text-[10px] text-tg-hint uppercase font-bold tracking-widest mt-1">{title}</div>
    </div>
);

export default SeasonView;