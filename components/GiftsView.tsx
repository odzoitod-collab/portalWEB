import React, { useState } from 'react';
import { Gift, Package, ShoppingBag, Box } from 'lucide-react';
import { NFT } from '../types';
import NFTCard from './NFTCard';
import Header from './Header';

interface GiftsViewProps {
  nfts: NFT[];
  onNftClick: (nft: NFT) => void;
  userBalance: number;
  onOpenWallet: () => void;
}

type GiftFilter = 'all' | 'gift' | 'purchase';

const GiftsView: React.FC<GiftsViewProps> = ({ nfts, onNftClick, userBalance, onOpenWallet }) => {
  const [filter, setFilter] = useState<GiftFilter>('all');

  const filteredNfts = nfts.filter(nft => {
      if (filter === 'all') return true;
      return nft.origin === filter;
  });

  return (
    <div className="pb-24 animate-fade-in min-h-screen pt-14">
      <Header balance={userBalance} onOpenWallet={onOpenWallet} title="Инвентарь" />

      {/* Filter Tabs */}
      <div className="px-4 mt-4 mb-6 sticky top-14 z-30 bg-[#000000]/95 backdrop-blur-xl py-2 -mx-1">
        <div className="flex bg-[#1c1c1e] p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <TabButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')} 
            label="Все" 
          />
          <TabButton 
            active={filter === 'gift'} 
            onClick={() => setFilter('gift')} 
            label="Подарки" 
          />
          <TabButton 
            active={filter === 'purchase'} 
            onClick={() => setFilter('purchase')} 
            label="Покупки" 
          />
        </div>
      </div>

      {filteredNfts.length > 0 ? (
        <div className="px-4 grid grid-cols-2 gap-3">
          {filteredNfts.map(nft => (
            <NFTCard key={nft.id} nft={nft} onClick={onNftClick} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-80">
           <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                <div className="w-32 h-32 bg-[#1c1c1e] rounded-[2.5rem] flex items-center justify-center rotate-6 border border-white/10 shadow-2xl relative z-10">
                        {filter === 'purchase' ? <ShoppingBag className="w-12 h-12 text-blue-400" /> : 
                        filter === 'gift' ? <Gift className="w-12 h-12 text-purple-400" /> :
                        <Box className="w-12 h-12 text-gray-400" />}
                </div>
           </div>
           
           <h3 className="text-white font-bold text-xl mb-1">Пусто</h3>
           <p className="text-tg-hint text-sm max-w-[200px] text-center">Здесь появятся ваши предметы после покупки или получения подарка.</p>
           
           <button onClick={() => setFilter('all')} className="mt-8 px-8 py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors shadow-lg active:scale-95">
              Сбросить фильтр
           </button>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
            active 
            ? 'bg-[#2c2c2e] text-white shadow-md ring-1 ring-white/10' 
            : 'text-tg-hint hover:text-white hover:bg-white/5'
        }`}
    >
        {label}
    </button>
);

export default GiftsView;