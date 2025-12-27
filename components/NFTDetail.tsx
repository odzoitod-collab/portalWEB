import React, { useState } from 'react';
import { NFT } from '../types';
import { X, Send, Users, Share2, ChevronRight, Gem, Sparkles, Check } from 'lucide-react';
import SellNFTSheet from './SellNFTSheet';

interface NFTDetailProps {
  nft: NFT;
  onBack: () => void;
  onBuy: (nft: NFT) => void;
  userBalance: number;
  isOwner: boolean;
  onOpenWallet: () => void;
  onSellNFT?: (nft: NFT, price: number) => void;
}

const NFTDetail: React.FC<NFTDetailProps> = ({ nft, onBack, onBuy, userBalance, isOwner, onOpenWallet, onSellNFT }) => {
  const canBuy = !isOwner && userBalance >= nft.price;
  const [isSellSheetOpen, setIsSellSheetOpen] = useState(false);

  const handleSell = (price: number) => {
    if (onSellNFT) {
      onSellNFT(nft, price);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 pt-4">
          <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/5 cursor-pointer" onClick={onOpenWallet}>
             <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Gem className="w-3 h-3 text-white" />
             </div>
             <span className="text-sm font-bold text-white">{userBalance.toFixed(2)}</span>
          </div>

          <button 
            onClick={onBack}
            className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white/70 hover:text-white transition-colors border border-white/5"
          >
            <X className="w-6 h-6" />
          </button>
      </div>

      <div className="flex-1 flex flex-col pt-20 px-4 pb-32">
        {/* Image */}
        <div className="w-64 h-64 mx-auto mb-6 relative group cursor-pointer">
             {/* Glow effect */}
            <div className={`absolute inset-0 blur-3xl rounded-full opacity-50 ${isOwner ? 'bg-green-500/20' : 'bg-[#007aff]/20'}`}></div>
            <img 
                src={nft.image} 
                alt={nft.title} 
                className={`w-full h-full object-cover rounded-[2rem] relative z-10 shadow-2xl border transition-transform group-hover:scale-105 ${isOwner ? 'border-green-500/30' : 'border-white/5'}`}
            />
            {isOwner && (
                <div className="absolute bottom-4 right-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Check className="w-3 h-3" /> Purchased
                </div>
            )}
        </div>

        {/* Title Block */}
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-1 mb-1 text-white">
                {nft.title} <ChevronRight className="w-6 h-6 text-tg-hint" />
            </h1>
            <div className="inline-block px-3 py-1 bg-[#1c1c1e] rounded-lg text-tg-hint text-sm font-medium border border-white/5">
                {nft.subtitle || `#${nft.id}`}
            </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
            <ActionButton icon={<Send className="w-5 h-5 mb-1" />} label="Следить" />
            <ActionButton icon={<Users className="w-5 h-5 mb-1" />} label="Статус" />
            <ActionButton icon={<Share2 className="w-5 h-5 mb-1" />} label="Поделиться" />
        </div>

        {/* Properties Table */}
        <div className="bg-[#1c1c1e] rounded-xl overflow-hidden mb-6 border border-white/5">
            <TableRow label="Модель" value={nft.model || "Базовая"} badge="1.5%" price="3.37" />
            <TableRow label="Символ" value={nft.collection || "Общий"} badge="0.7%" price="3.37" />
            <TableRow label="Фон" value={nft.backdrop || "Стандарт"} badge="1.5%" price="3.5" />
            <div className="flex items-center justify-between p-3.5 bg-[#1c1c1e]">
                <span className="text-tg-hint font-medium text-sm">Мин. цена</span>
                <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                    {/* Diamond icon simulation */}
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white"></div>
                    <span>{nft.price} TON</span>
                </div>
            </div>
        </div>

        {/* Rewards Info */}
        <div className="space-y-3 mb-6 px-1">
            <div className="flex justify-between items-center text-sm">
                <span className="text-tg-hint">Награда за покупку</span>
                <div className="flex items-center gap-1 text-[#ffd700] font-bold">
                    <span>600</span>
                    <Sparkles className="w-3.5 h-3.5 fill-[#ffd700]" />
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-1 text-tg-hint">
                    <span>Кэшбек</span>
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-600 flex items-center justify-center text-[9px] opacity-70">i</div>
                 </div>
                 <div className="flex items-center gap-1 text-[#007aff] font-bold">
                    <span>0</span>
                    <Gem className="w-3.5 h-3.5 fill-[#007aff]/20" />
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Fixed Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000000]/95 backdrop-blur-xl p-4 pb-8 max-w-md mx-auto border-t border-white/5 z-40">
        <div className="flex gap-3">
             {isOwner && (
               <button 
                 onClick={() => setIsSellSheetOpen(true)}
                 className="flex-1 py-3 bg-[#1c1c1e] rounded-xl font-bold text-white hover:bg-[#2c2c2e] transition-colors text-[15px] border border-white/5 active:scale-95"
               >
                  Предложить цену
               </button>
             )}
             
             {isOwner ? (
                <button 
                    disabled
                    className="flex-1 py-2 bg-green-500/20 text-green-500 rounded-xl font-bold cursor-default border border-green-500/20 flex flex-col items-center justify-center"
                >
                    <span className="text-[15px]">Вы владелец</span>
                    <span className="text-[11px] opacity-80 font-medium">Куплено</span>
                </button>
             ) : (
                <button 
                    onClick={() => canBuy ? onBuy(nft) : onOpenWallet()}
                    disabled={false}
                    className={`flex-1 py-2 rounded-xl font-bold text-white transition-colors flex flex-col items-center justify-center active:scale-95 ${
                        canBuy 
                        ? 'bg-[#007aff] hover:bg-[#006bdd]' 
                        : 'bg-red-500/80 hover:bg-red-600'
                    }`}
                >
                    <span className="text-[15px]">{canBuy ? 'Купить сейчас' : 'Пополнить баланс'}</span>
                    <span className="text-[11px] opacity-80 font-medium">{nft.price} TON</span>
                </button>
             )}
        </div>
      </div>

      {/* Sell NFT Sheet */}
      <SellNFTSheet 
        isOpen={isSellSheetOpen}
        onClose={() => setIsSellSheetOpen(false)}
        nft={nft}
        onSell={handleSell}
      />
    </div>
  );
};

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="bg-[#1c1c1e] py-3 rounded-xl flex flex-col items-center justify-center active:scale-95 transition-transform hover:bg-[#2c2c2e] border border-white/5">
        <div className="text-white">{icon}</div>
        <span className="text-xs font-medium text-tg-hint mt-1">{label}</span>
    </button>
);

const TableRow = ({ label, value, badge, price }: { label: string, value: string, badge: string, price: string }) => (
    <div className="flex items-center justify-between p-3.5 border-b border-white/5 last:border-0">
        <span className="text-tg-hint font-medium text-sm">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[#007aff] text-sm font-medium">{value}</span>
            <span className="bg-[#007aff]/10 text-[#007aff] text-[10px] font-bold px-1.5 py-0.5 rounded">{badge}</span>
            <div className="flex items-center gap-1 text-white text-sm">
                <span>{price}</span>
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-white/70"></div>
            </div>
        </div>
    </div>
);

export default NFTDetail;