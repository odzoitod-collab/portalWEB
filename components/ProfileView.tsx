import React from 'react';
import { User } from '../types';
import { Settings, ChevronRight, Gift, ShoppingBag, BarChart3, Wallet } from 'lucide-react';

interface ProfileViewProps {
  user: User | null;
  onOpenWalletSheet: () => void;
  onOpenSettings: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onOpenWalletSheet, onOpenSettings }) => {
  return (
    <div className="pb-24 animate-fade-in relative">
        
        {/* Cover Background */}
        <div className="absolute top-0 left-0 right-0 h-[320px] overflow-hidden z-0">
             <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ 
                    backgroundImage: "url('https://s3.coinmarketcap.com/static-gravity/image/04b9c957f16141008342f97caf80aa7e.jpg')" 
                }}
             ></div>
             <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#000000]/60 to-[#000000]"></div>
        </div>

        {/* Profile Header */}
        <div className="px-4 flex flex-col items-center mb-8 relative z-10 pt-16">
            <div className="relative group">
                <div className="absolute inset-0 bg-[#007aff]/30 blur-2xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#1c1c1e] shadow-2xl relative z-10">
                    <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>
            
            <h1 className="text-2xl font-bold mt-4 text-white tracking-tight drop-shadow-lg">{user?.username}</h1>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-2 px-4 mb-8 relative z-10">
            <StatCard label="Торговля" value={`${user?.totalVolume} TON`} icon={<BarChart3 className="w-4 h-4 text-blue-400" />} />
            <StatCard label="Коллекция" value={`${user?.bought}`} icon={<Gift className="w-4 h-4 text-purple-400" />} />
            <StatCard label="Продажи" value={`${user?.sold}`} icon={<ShoppingBag className="w-4 h-4 text-green-400" />} />
        </div>

        {/* Action Menu (Telegram Style) */}
        <div className="px-4 space-y-4 relative z-10">
            
            {/* Wallet Section */}
            <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                <MenuItem 
                    icon={<Wallet className="w-5 h-5" />} 
                    label="Кошелек" 
                    value={`${user?.balance} TON`} 
                    color="bg-[#007aff]"
                    onClick={onOpenWalletSheet}
                />
            </div>

            {/* Settings */}
            <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                <MenuItem 
                    icon={<Settings className="w-5 h-5" />} 
                    label="Настройки" 
                    color="bg-gray-500"
                    onClick={onOpenSettings}
                />
            </div>
        </div>

        <div className="mt-8 text-center relative z-10">
            <p className="text-tg-hint text-xs font-medium opacity-50">Member since 2024</p>
        </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-[#1c1c1e]/80 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center border border-white/5 active:scale-95 transition-transform shadow-lg">
        <div className="mb-1.5 p-2 bg-white/5 rounded-full">{icon}</div>
        <div className="font-bold text-white text-sm mb-0.5">{value}</div>
        <div className="text-[10px] text-tg-hint font-medium uppercase tracking-wide">{label}</div>
    </div>
);

const MenuItem: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value?: string; 
    color: string;
    onClick: () => void 
}> = ({ icon, label, value, color, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0 active:bg-white/10"
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white shadow-lg`}>
                {icon}
            </div>
            <span className="text-[15px] font-medium text-white">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-[#007aff] text-[15px] font-medium">{value}</span>}
            <ChevronRight className="w-5 h-5 text-tg-hint/50 group-hover:text-tg-hint transition-colors" />
        </div>
    </button>
);

export default ProfileView;