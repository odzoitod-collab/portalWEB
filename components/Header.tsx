import React from 'react';
import { Gem } from 'lucide-react';

interface HeaderProps {
  balance?: number;
  onOpenWallet: () => void;
  title?: string;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  balance = 0, 
  onOpenWallet, 
  title, 
  transparent = false 
}) => {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 h-14 flex items-center justify-between transition-colors duration-300 ${transparent ? 'bg-transparent' : 'bg-[#000000]/80 backdrop-blur-xl border-b border-white/5'}`}>
       <div className="flex items-center gap-2">
            {!title ? (
                <>
                    <img 
                        src="/images/logo.png" 
                        alt="Portal Logo"
                        className="w-8 h-8 rounded-full object-cover shadow-lg"
                    />
                    <span className="font-bold text-lg tracking-tight text-white">Portal</span>
                </>
            ) : (
                <span className="font-bold text-xl tracking-tight text-white">{title}</span>
            )}
        </div>
        
        <button 
            onClick={onOpenWallet}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all active:scale-95 border ${
                transparent 
                ? 'bg-white/10 text-white hover:bg-white/20 border-white/10' 
                : 'bg-[#007aff]/10 text-[#007aff] hover:bg-[#007aff]/20 border-[#007aff]/10'
            }`}
        >
            <Gem className="w-4 h-4" />
            <span>{typeof balance === 'number' ? balance.toFixed(2) : balance}</span>
        </button>
    </div>
  );
};

export default Header;