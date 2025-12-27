import React from 'react';
import { X, Trophy, TrendingUp, Users, Zap, Star, Award, Crown } from 'lucide-react';

interface SeasonCompetitionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SeasonCompetitionSheet: React.FC<SeasonCompetitionSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Content */}
      <div className="relative h-full overflow-y-auto">
        <div className="min-h-full px-4 py-6 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">Сезонный конкурс</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors active:scale-95"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-3xl p-6 mb-6 border border-yellow-500/20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
                <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Season II Challenge</span>
              </div>
              
              <h3 className="text-3xl font-black text-white mb-3 leading-tight">
                Торгуй и побеждай!
              </h3>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Участвуй в сезонном конкурсе и получи шанс выиграть эксклюзивные NFT. 
                Чем больше сделок ты совершишь, тем выше твои шансы на победу!
              </p>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs font-bold uppercase">Призовой фонд</span>
                  <span className="text-yellow-400 text-2xl font-black">50,000 TON</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-bold uppercase">Осталось времени</span>
                  <span className="text-white text-lg font-bold">12 дней</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="bg-[#1c1c1e] rounded-3xl p-6 mb-6 border border-white/5">
            <h4 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Как участвовать
            </h4>
            
            <div className="space-y-4">
              <RuleItem 
                number="1"
                title="Совершай сделки"
                description="Покупай и продавай NFT на маркетплейсе. Каждая сделка приносит очки."
                color="text-blue-400"
              />
              <RuleItem 
                number="2"
                title="Набирай очки"
                description="За покупку: +10 очков. За продажу: +15 очков. Бонус за редкие NFT: +50 очков."
                color="text-purple-400"
              />
              <RuleItem 
                number="3"
                title="Поднимайся в рейтинге"
                description="Чем больше очков, тем выше твоя позиция в таблице лидеров."
                color="text-yellow-400"
              />
              <RuleItem 
                number="4"
                title="Получи награду"
                description="Топ-10 участников получат эксклюзивные NFT и TON в конце сезона."
                color="text-green-400"
              />
            </div>
          </div>

          {/* Prizes Section */}
          <div className="bg-[#1c1c1e] rounded-3xl p-6 mb-6 border border-white/5">
            <h4 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Призы
            </h4>
            
            <div className="space-y-3">
              <PrizeItem 
                place="1"
                prize="Golden Scarab NFT + 10,000 TON"
                icon={<Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                gradient="from-yellow-600/20 to-amber-600/20"
                borderColor="border-yellow-500/30"
              />
              <PrizeItem 
                place="2"
                prize="Silver Sphinx NFT + 5,000 TON"
                icon={<Trophy className="w-5 h-5 text-gray-300 fill-gray-300/20" />}
                gradient="from-gray-600/20 to-gray-700/20"
                borderColor="border-gray-500/30"
              />
              <PrizeItem 
                place="3"
                prize="Bronze Pharaoh NFT + 2,500 TON"
                icon={<Trophy className="w-5 h-5 text-orange-400 fill-orange-400/20" />}
                gradient="from-orange-600/20 to-orange-700/20"
                borderColor="border-orange-500/30"
              />
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Star className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">4-10 место</div>
                    <div className="text-gray-400 text-xs">Эксклюзивные NFT + 500 TON</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-[#1c1c1e] rounded-3xl p-6 mb-6 border border-white/5">
            <h4 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Топ участников
            </h4>
            
            <div className="space-y-2">
              <LeaderboardItem rank={1} name="CryptoKing" points={2450} trend="+125" />
              <LeaderboardItem rank={2} name="NFTMaster" points={2180} trend="+98" />
              <LeaderboardItem rank={3} name="TradeWizard" points={1950} trend="+76" />
              <LeaderboardItem rank={4} name="DiamondHands" points={1720} trend="+54" />
              <LeaderboardItem rank={5} name="MoonTrader" points={1580} trend="+42" />
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Ваша позиция:</span>
                <span className="text-white font-bold">—</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Ваши очки:</span>
                <span className="text-white font-bold">0</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-4 rounded-2xl font-black text-lg hover:from-yellow-400 hover:to-amber-500 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(234,179,8,0.3)]"
          >
            <Trophy className="w-6 h-6" />
            Начать участие
          </button>
          
          <p className="text-center text-gray-500 text-xs mt-4">
            Конкурс продлится до 31 декабря 2024
          </p>
        </div>
      </div>
    </div>
  );
};

interface RuleItemProps {
  number: string;
  title: string;
  description: string;
  color: string;
}

const RuleItem: React.FC<RuleItemProps> = ({ number, title, description, color }) => (
  <div className="flex gap-4">
    <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 ${color} font-black`}>
      {number}
    </div>
    <div className="flex-1">
      <div className="text-white font-bold text-sm mb-1">{title}</div>
      <div className="text-gray-400 text-xs leading-relaxed">{description}</div>
    </div>
  </div>
);

interface PrizeItemProps {
  place: string;
  prize: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
}

const PrizeItem: React.FC<PrizeItemProps> = ({ place, prize, icon, gradient, borderColor }) => (
  <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-4 border ${borderColor}`}>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full bg-black/30 flex items-center justify-center border ${borderColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-white font-black text-sm">{place} место</div>
        <div className="text-gray-300 text-xs">{prize}</div>
      </div>
    </div>
  </div>
);

interface LeaderboardItemProps {
  rank: number;
  name: string;
  points: number;
  trend: string;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, name, points, trend }) => {
  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors">
      <div className={`w-8 h-8 rounded-full bg-black/30 flex items-center justify-center font-black text-sm ${getRankColor()} border border-white/10`}>
        {rank}
      </div>
      <div className="flex-1">
        <div className="text-white font-bold text-sm">{name}</div>
        <div className="text-gray-400 text-xs">{points.toLocaleString()} очков</div>
      </div>
      <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </div>
    </div>
  );
};

export default SeasonCompetitionSheet;
