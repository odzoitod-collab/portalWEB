import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  subLabel?: string; 
  image?: string;
  color?: string;
  floorPrice: number;
  change?: string; 
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  options, 
  selectedValues, 
  onToggle, 
  onClear 
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-[#1c1c1e] w-full rounded-t-3xl max-w-md mx-auto relative overflow-hidden flex flex-col h-[85vh] animate-in slide-in-from-bottom duration-300 shadow-2xl border-t border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
            <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-tg-hint text-sm">Выберите один или несколько</p>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-tg-hint hover:text-white transition-colors bg-white/5 rounded-full">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Search */}
        <div className="px-4 mb-4 pt-2">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tg-hint" />
                <input 
                    type="text"
                    placeholder={`Поиск по ${title.toLowerCase()}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/30 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-tg-hint outline-none focus:border-[#007aff] transition-colors text-sm"
                />
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-1 no-scrollbar pb-4">
            {filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.id);
                return (
                    <div 
                        key={opt.id}
                        onClick={() => onToggle(opt.id)}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 cursor-pointer group active:opacity-70 transition-opacity"
                    >
                        <div className="flex items-center gap-4">
                            {/* Checkbox */}
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'bg-[#007aff] border-[#007aff]' : 'border-white/20 group-hover:border-white/40'}`}>
                                {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                            </div>

                            {/* Image/Color */}
                            {opt.image ? (
                                <img src={opt.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/5" />
                            ) : opt.color ? (
                                <div className="w-10 h-10 rounded-full flex-shrink-0 border border-white/10" style={{ backgroundColor: opt.color }}></div>
                            ) : null}

                            {/* Label & Badge */}
                            <div>
                                <div className="font-bold text-white text-[15px] flex items-center gap-2">
                                    {opt.label}
                                    {opt.subLabel && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${opt.subLabel.includes('PRE') || opt.subLabel.includes('NEW') ? 'bg-red-500 text-white' : 'bg-[#007aff] text-white'}`}>
                                            {opt.subLabel}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[#007aff] text-xs font-bold">{opt.change || '1%'}</div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                             <div className="font-medium text-white text-[15px] flex items-center justify-end gap-1">
                                {opt.floorPrice} <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white/80"></div>
                             </div>
                             <div className="text-tg-hint text-xs">Мин. цена</div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex gap-3 bg-[#1c1c1e] pb-8">
            <button 
                onClick={onClose}
                className="flex-1 py-3.5 bg-white/5 rounded-xl font-bold text-white hover:bg-white/10 transition-colors border border-white/5"
            >
                Закрыть
            </button>
             <button 
                onClick={onClear}
                className="flex-1 py-3.5 bg-white/5 text-tg-hint rounded-xl font-bold hover:bg-white/10 hover:text-white transition-colors border border-white/5"
            >
                Сбросить
            </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSheet;