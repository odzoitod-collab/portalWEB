import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { NFT } from '../types';
import NFTCard from './NFTCard';
import FilterSheet, { FilterOption } from './FilterSheet';
import Header from './Header';

interface StoreViewProps {
  nfts: NFT[];
  onNftClick: (nft: NFT) => void;
  userBalance?: number;
  onOpenWallet: () => void;
}

const BANNER_SLIDES = [
    {
        id: 1,
        title: "Смешные Персонажи",
        subtitle: "Коллекция уникальных NFT",
        tag: "21 персонаж",
        gradient: "from-purple-900 to-[#1c1c1e]",
        image: "https://lh3.googleusercontent.com/gg-dl/ABS2GSmVAXtI-NNWz0ucmmJ0tHJOEtsX-giu74e9gj3oZfXVJ0sgyF-qbaPqgs_YOqUnPbxjxih6SakTj6xTjtBU_sP9x4V4Tqm-cKgycjwAHlOvW3rCiPSNEeob4zMO08ztZww-kLYBdPuMFU0Bui9aCYObtqDLRcg5QPkWOW9czr0mEEGG8g=s1024-rj",
        textColor: "text-purple-300",
        tagBg: "bg-purple-500/20 border-purple-500/30 text-purple-300"
    },
    {
        id: 2,
        title: "Император Величкин",
        subtitle: "Самый редкий персонаж",
        tag: "45 TON",
        gradient: "from-yellow-900 to-[#1c1c1e]",
        image: "https://lh3.googleusercontent.com/gg-dl/ABS2GSmVAXtI-NNWz0ucmmJ0tHJOEtsX-giu74e9gj3oZfXVJ0sgyF-qbaPqgs_YOqUnPbxjxih6SakTj6xTjtBU_sP9x4V4Tqm-cKgycjwAHlOvW3rCiPSNEeob4zMO08ztZww-kLYBdPuMFU0Bui9aCYObtqDLRcg5QPkWOW9czr0mEEGG8g=s1024-rj",
        textColor: "text-yellow-300",
        tagBg: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
    },
    {
        id: 3,
        title: "Новые Герои",
        subtitle: "Пополнение коллекции",
        tag: "Скоро",
        gradient: "from-cyan-900 to-[#1c1c1e]",
        image: "https://lh3.googleusercontent.com/gg-dl/ABS2GSmVAXtI-NNWz0ucmmJ0tHJOEtsX-giu74e9gj3oZfXVJ0sgyF-qbaPqgs_YOqUnPbxjxih6SakTj6xTjtBU_sP9x4V4Tqm-cKgycjwAHlOvW3rCiPSNEeob4zMO08ztZww-kLYBdPuMFU0Bui9aCYObtqDLRcg5QPkWOW9czr0mEEGG8g=s1024-rj",
        textColor: "text-cyan-300",
        tagBg: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300"
    }
];

const TABS = ['Все', 'Коллекции', 'Наборы'];

// Map for backdrop colors
const BACKDROP_COLORS: Record<string, string> = {
    'Мистика': '#4B0082',
    'Студия': '#808080',
    'Песок': '#F4A460',
    'Космос': '#191970',
    'Город': '#2F4F4F',
    'Пустота': '#000000',
    'Черный': '#1c1c1e',
    'Циан': '#008B8B',
    'Зеленый': '#006400',
    'Металл': '#2a3439'
};

const StoreView: React.FC<StoreViewProps> = ({ 
  nfts, 
  onNftClick, 
  userBalance,
  onOpenWallet
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Все');
  
  // Multi-select filters
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedBackdrops, setSelectedBackdrops] = useState<string[]>([]);
  
  // Modal State
  const [activeFilterSheet, setActiveFilterSheet] = useState<'collection' | 'model' | 'backdrop' | null>(null);

  // Helper to calculate statistics for options
  const generateOptions = (key: keyof NFT, colorMap?: Record<string, string>, useImages: boolean = false): FilterOption[] => {
    const groups: Record<string, { min: number; count: number }> = {};
    nfts.forEach(nft => {
        const val = nft[key] as string;
        if (!val) return;
        if (!groups[val]) groups[val] = { min: nft.price, count: 0 };
        groups[val].min = Math.min(groups[val].min, nft.price);
        groups[val].count++;
    });

    return Object.keys(groups).map((label, idx) => ({
        id: label,
        label: label,
        floorPrice: groups[label].min,
        color: colorMap ? (colorMap[label] || '#333') : undefined,
        image: useImages ? `https://picsum.photos/100/100?random=${100 + idx}` : undefined,
        subLabel: idx % 3 === 0 ? "NEW" : idx % 4 === 0 ? "-20%" : undefined,
        change: `${(Math.random() * 5).toFixed(1)}%`
    }));
  };

  const collectionOptions = useMemo(() => generateOptions('collection', undefined, true), [nfts]);
  const modelOptions = useMemo(() => generateOptions('model'), [nfts]);
  const backdropOptions = useMemo(() => generateOptions('backdrop', BACKDROP_COLORS), [nfts]);

  // Filtering Logic
  const filteredNFTs = useMemo(() => {
    return nfts.filter(nft => {
      // Search
      const matchesSearch = 
        nft.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (nft.subtitle && nft.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      if (activeTab === 'Наборы') return false; 
      
      // Multi-select Logic (OR within category, AND between categories)
      if (selectedCollections.length > 0 && !selectedCollections.includes(nft.collection || '')) return false;
      if (selectedModels.length > 0 && !selectedModels.includes(nft.model || '')) return false;
      if (selectedBackdrops.length > 0 && !selectedBackdrops.includes(nft.backdrop || '')) return false;

      return true;
    });
  }, [nfts, searchQuery, activeTab, selectedCollections, selectedModels, selectedBackdrops]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 4000); 

    return () => clearInterval(timer);
  }, []);

  const toggleFilter = (setFn: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setFn(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };

  return (
    <div className="pb-24 animate-fade-in pt-14">
        <Header balance={userBalance} onOpenWallet={onOpenWallet} />

        {/* Banner */}
        <div className="px-4 pt-2 mb-6">
            <div className={`w-full h-20 md:h-24 transition-colors duration-700 bg-gradient-to-r ${BANNER_SLIDES[currentSlide].gradient} rounded-2xl relative overflow-hidden flex items-center shadow-lg border border-white/5`}>
                {/* Background Image Layer */}
                {BANNER_SLIDES.map((slide, index) => (
                    <div 
                        key={slide.id}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    ></div>
                ))}
                
                {/* Decorative Monogram Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 z-[1]">
                    {/* Top Left Monogram */}
                    <div className="absolute -top-8 -left-8 w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center rotate-12">
                        <div className="text-white/40 font-black text-4xl italic">P</div>
                    </div>
                    
                    {/* Top Right Monogram */}
                    <div className="absolute -top-6 right-8 w-24 h-24 border-4 border-white/15 rounded-full flex items-center justify-center -rotate-12">
                        <div className="text-white/30 font-black text-3xl italic">M</div>
                    </div>
                    
                    {/* Bottom Right Monogram */}
                    <div className="absolute -bottom-10 -right-10 w-36 h-36 border-4 border-white/20 rounded-full flex items-center justify-center rotate-45">
                        <div className="text-white/40 font-black text-5xl italic">N</div>
                    </div>
                    
                    {/* Center Small Monogram */}
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-16 h-16 border-2 border-white/10 rounded-full flex items-center justify-center -rotate-6">
                        <div className="text-white/20 font-black text-xl italic">★</div>
                    </div>
                    
                    {/* Geometric Patterns */}
                    <div className="absolute top-4 right-1/4 w-12 h-12 border-2 border-white/10 rotate-45"></div>
                    <div className="absolute bottom-4 left-1/4 w-8 h-8 border-2 border-white/10 rounded-full"></div>
                </div>
                
                {/* Animated Particles */}
                <div className="absolute inset-0 z-[2]">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
                    <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                </div>
                
                {/* Gradient Overlay for Better Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 z-[3]"></div>
                
                {/* Content */}
                <div className="relative z-10 px-4 w-full">
                     <div className="transition-all duration-500" key={currentSlide}>
                        <h2 className="text-base font-bold text-white mb-0.5 leading-tight drop-shadow-lg">{BANNER_SLIDES[currentSlide].title}</h2>
                        <p className={`${BANNER_SLIDES[currentSlide].textColor} text-[10px] mb-1.5 font-medium drop-shadow-md`}>{BANNER_SLIDES[currentSlide].subtitle}</p>
                        <div className={`${BANNER_SLIDES[currentSlide].tagBg} text-[9px] font-bold px-2 py-0.5 rounded inline-block border backdrop-blur-sm shadow-lg`}>
                            {BANNER_SLIDES[currentSlide].tag}
                        </div>
                    </div>
                </div>
                
                {/* Slide Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {BANNER_SLIDES.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-0.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-4 bg-white shadow-lg' : 'w-1 bg-white/30'}`}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-5">
             <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                {TABS.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-2xl font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-white' : 'text-tg-hint hover:text-white/80'}`}
                    >
                        {tab}
                    </button>
                ))}
             </div>
        </div>

        {/* Filter Buttons */}
        <div className="px-4 mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <FilterButton 
                label="Коллекция" 
                value={selectedCollections} 
                onClick={() => setActiveFilterSheet('collection')}
            />
            <FilterButton 
                label="Модель" 
                value={selectedModels} 
                onClick={() => setActiveFilterSheet('model')}
            />
            <FilterButton 
                label="Фон" 
                value={selectedBackdrops} 
                onClick={() => setActiveFilterSheet('backdrop')}
            />
            
            <button className="bg-tg-card border border-white/5 h-[54px] w-[54px] flex items-center justify-center rounded-2xl flex-shrink-0 text-white hover:bg-white/10 active:scale-95 transition-all">
                <ChevronDown className="w-6 h-6" />
            </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-6">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tg-hint group-focus-within:text-white transition-colors" />
                <input 
                    type="text"
                    placeholder="Поиск по ID или названию"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-tg-card border border-white/5 focus:border-[#007aff]/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-tg-hint outline-none transition-all text-sm"
                />
            </div>
        </div>

        {/* Grid */}
        <div className="px-4 min-h-[200px]">
            {filteredNFTs.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {filteredNFTs.map(nft => (
                        <NFTCard key={nft.id} nft={nft} onClick={onNftClick} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-12 text-tg-hint">
                    <div className="w-16 h-16 rounded-full bg-tg-card border border-white/5 flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 opacity-30" />
                    </div>
                    <p className="font-medium">Ничего не найдено</p>
                    <button 
                        onClick={() => {
                            setSelectedCollections([]);
                            setSelectedModels([]);
                            setSelectedBackdrops([]);
                            setSearchQuery('');
                            setActiveTab('Все');
                        }}
                        className="mt-4 text-[#007aff] text-sm font-bold hover:opacity-80 transition-opacity"
                    >
                        Сбросить фильтры
                    </button>
                </div>
            )}
        </div>

        {/* Filter Sheets */}
        <FilterSheet 
            isOpen={activeFilterSheet === 'collection'}
            onClose={() => setActiveFilterSheet(null)}
            title="Коллекция"
            options={collectionOptions}
            selectedValues={selectedCollections}
            onToggle={(id) => toggleFilter(setSelectedCollections, id)}
            onClear={() => setSelectedCollections([])}
        />
        <FilterSheet 
            isOpen={activeFilterSheet === 'model'}
            onClose={() => setActiveFilterSheet(null)}
            title="Модель"
            options={modelOptions}
            selectedValues={selectedModels}
            onToggle={(id) => toggleFilter(setSelectedModels, id)}
            onClear={() => setSelectedModels([])}
        />
        <FilterSheet 
            isOpen={activeFilterSheet === 'backdrop'}
            onClose={() => setActiveFilterSheet(null)}
            title="Фон"
            options={backdropOptions}
            selectedValues={selectedBackdrops}
            onToggle={(id) => toggleFilter(setSelectedBackdrops, id)}
            onClear={() => setSelectedBackdrops([])}
        />

    </div>
  );
};

interface FilterButtonProps {
    label: string;
    value: string[];
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, value, onClick }) => (
    <button 
        onClick={onClick}
        className={`bg-tg-card border border-white/5 rounded-2xl px-4 py-3 flex items-center justify-between min-w-[140px] flex-shrink-0 transition-all active:scale-95 ${value.length > 0 ? 'bg-[#007aff]/10 border-[#007aff]/50' : ''}`}
    >
        <div className="text-left">
            <div className="text-xs text-tg-hint mb-0.5 font-medium">{label}</div>
            <div className={`text-sm font-bold truncate max-w-[90px] ${value.length > 0 ? 'text-[#007aff]' : 'text-white'}`}>
                {value.length > 0 ? (value.length === 1 ? value[0] : `Выбрано: ${value.length}`) : 'Все'}
            </div>
        </div>
        <div className="flex flex-col gap-0.5">
            <ChevronUp className="w-2.5 h-2.5 text-tg-hint" />
            <ChevronDown className="w-2.5 h-2.5 text-tg-hint" />
        </div>
    </button>
);

export default StoreView;