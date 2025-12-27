import React from 'react';
import { NFT } from '../types';
import { Gem, ShoppingBag } from 'lucide-react';

interface NFTCardProps {
  nft: NFT;
  onClick: (nft: NFT) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onClick }) => {
  return (
    <div 
      className="bg-tg-card rounded-2xl overflow-hidden cursor-pointer active:opacity-90 active:scale-[0.98] transition-all flex flex-col h-full border border-white/5 shadow-lg relative group"
      onClick={() => onClick(nft)}
    >
      <div className="aspect-square bg-[#2c2c2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
        <img 
          src={nft.image} 
          alt={nft.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {nft.verified && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-lg z-20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-white text-[15px] leading-tight mb-0.5 truncate">{nft.title}</h3>
        <span className="text-tg-hint text-xs font-medium mb-3">{nft.subtitle || `#${nft.id}`}</span>
        
        <div className="mt-auto flex items-center gap-2">
            <button className="flex-1 bg-[#007aff] hover:bg-[#006bdd] text-white rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 font-bold text-sm transition-colors">
                <Gem className="w-3.5 h-3.5 fill-white/30" />
                <span>{nft.price}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;