import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { NFT } from '../types';

interface SellNFTSheetProps {
  isOpen: boolean;
  onClose: () => void;
  nft: NFT;
  onSell: (price: number) => void;
}

const SellNFTSheet: React.FC<SellNFTSheetProps> = ({ isOpen, onClose, nft, onSell }) => {
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const priceNum = parseFloat(price);
    
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('❌ Введите корректную цену');
      return;
    }

    if (priceNum < 1) {
      alert('❌ Минимальная цена: 1 TON');
      return;
    }

    if (priceNum > 10000) {
      alert('❌ Максимальная цена: 10,000 TON');
      return;
    }

    setIsSubmitting(true);
    await onSell(priceNum);
    setIsSubmitting(false);
    setPrice('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1e] rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Предложить цену</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* NFT Preview */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-xl">
            <img 
              src={nft.image} 
              alt={nft.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-white">{nft.title}</h3>
              <p className="text-sm text-white/50">{nft.subtitle}</p>
            </div>
          </div>

          {/* Price Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Цена продажи (TON)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007aff] transition-colors"
              />
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>Минимум: 0.01 TON</span>
              <span>Максимум: 10,000 TON</span>
            </div>
            <p className="text-xs text-white/50 mt-2">
              Ваш реферер получит уведомление и сможет одобрить продажу. После одобрения деньги будут зачислены на ваш баланс.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !price}
              className="flex-1 py-3 rounded-xl font-semibold bg-[#007aff] text-white hover:bg-[#0066cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Отправка...' : 'Предложить'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellNFTSheet;
