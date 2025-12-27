import React from 'react';
import { X, ArrowUp, Plus, Gem, History } from 'lucide-react';
import { Transaction } from '../types';

interface WalletSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  history: Transaction[];
  onDeposit: () => void;
  onCardDeposit: () => void;
  onWithdraw: () => void;
}

const WalletSheet: React.FC<WalletSheetProps> = ({ isOpen, onClose, balance, history, onDeposit, onCardDeposit, onWithdraw }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-[#1c1c1e] w-full rounded-t-[32px] max-w-md mx-auto relative overflow-hidden animate-in slide-in-from-bottom duration-300 h-[85vh] flex flex-col shadow-2xl border-t border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-2 text-tg-hint">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></span>
                <span className="text-sm font-medium">TON Connect</span>
            </div>
            <button onClick={onClose} className="bg-white/5 rounded-full p-1.5 text-tg-hint hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Blue Card */}
        <div className="p-5">
            <div className="bg-gradient-to-br from-[#007aff] to-[#00c6ff] rounded-[28px] p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,122,255,0.4)] relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="text-white/80 text-sm font-medium mb-2 tracking-wide">Общий баланс</div>
                    <div className="text-5xl font-black text-white mb-8 tracking-tight drop-shadow-sm">
                        {balance.toFixed(2)} <span className="text-3xl opacity-70">TON</span>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={onCardDeposit}
                            className="bg-white text-black font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 hover:bg-white/90 transition-colors active:scale-95 shadow-lg flex-1 justify-center"
                        >
                            <Plus className="w-4 h-4" /> Пополнить
                        </button>
                        <button 
                            onClick={onWithdraw}
                            className="bg-white/20 backdrop-blur-md text-white font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 hover:bg-white/30 transition-colors active:scale-95 border border-white/10 flex-1 justify-center"
                        >
                            <ArrowUp className="w-4 h-4" /> Вывести
                        </button>
                    </div>
                </div>
                
                {/* Background decorative icons */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-900/40 rounded-full blur-3xl"></div>
                <Gem className="absolute top-6 left-6 w-8 h-8 text-white/20 rotate-12 opacity-50" />
                <Gem className="absolute bottom-20 right-8 w-12 h-12 text-white/10 -rotate-12" />
            </div>
        </div>

        {/* Recent Actions */}
        <div className="flex-1 px-5 py-4 bg-black/20 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-tg-hint" /> История
                </h3>
            </div>

            {history.length > 0 ? (
                <div className="space-y-2">
                    {history.slice(0, 5).map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span className="text-sm font-medium text-white">{item.title}</span>
                            <span className={`text-sm font-bold ${item.amount.includes('+') ? 'text-green-400' : 'text-white'}`}>{item.amount}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-20 text-center opacity-50">
                    <p className="text-tg-hint text-sm">Транзакций нет</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WalletSheet;