import React, { useState, useEffect } from 'react';
import { X, CreditCard, Copy, Check, AlertCircle } from 'lucide-react';
import { getAllSettings } from '../services/supabaseClient';

interface CardDepositSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amountTon: number, amountRub: number) => void;
}

const CardDepositSheet: React.FC<CardDepositSheetProps> = ({ isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'amount' | 'card'>('amount');
  const [copied, setCopied] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardBank, setCardBank] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Курс: 1 TON = 300 RUB (можно вынести в настройки)
  const TON_TO_RUB_RATE = 300;

  useEffect(() => {
    if (isOpen) {
      loadCardInfo();
    }
  }, [isOpen]);

  const loadCardInfo = async () => {
    setLoading(true);
    try {
      const settings = await getAllSettings();
      setCardNumber(settings.card_number || '0000 0000 0000 0000');
      setCardHolder(settings.card_holder || 'CARDHOLDER NAME');
      setCardBank(settings.card_bank || 'Bank Name');
    } catch (error) {
      console.error('Error loading card info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 100) {
      alert('❌ Минимальная сумма: 100 ₽');
      return;
    }
    if (amountNum > 1000000) {
      alert('❌ Максимальная сумма: 1,000,000 ₽');
      return;
    }
    setStep('card');
  };

  const getRubAmount = () => {
    return parseFloat(amount) || 0;
  };

  const getTonAmount = () => {
    const rub = getRubAmount();
    return (rub / TON_TO_RUB_RATE).toFixed(2);
  };

  const handleConfirm = () => {
    const tonAmount = parseFloat(getTonAmount());
    const rubAmount = parseFloat(getRubAmount());
    onConfirm(tonAmount, rubAmount);
    setStep('amount');
    setAmount('');
    onClose();
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={handleClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1e] rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-w-md mx-auto max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {step === 'amount' ? 'Пополнение баланса' : 'Реквизиты карты'}
            </h2>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Step 1: Amount */}
          {step === 'amount' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Сумма пополнения (₽)
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="number"
                    step="100"
                    min="100"
                    max="1000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007aff] transition-colors text-lg font-semibold"
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-2">
                  <span>Минимум: 100 ₽</span>
                  <span>Максимум: 1,000,000 ₽</span>
                </div>
                {amount && parseFloat(amount) >= 100 && (
                  <div className="mt-2 text-center">
                    <span className="text-sm text-white/70">≈ </span>
                    <span className="text-lg font-bold text-[#007aff]">{getTonAmount()} TON</span>
                    <span className="text-xs text-white/50 ml-2">(курс: 1 TON = {TON_TO_RUB_RATE} ₽)</span>
                  </div>
                )}
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 3000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    {val} ₽
                  </button>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-1">Важно:</p>
                    <p className="text-blue-200/80">
                      После перевода нажмите "Я оплатил". Средства поступят на баланс после проверки платежа (обычно 1-5 минут).
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!amount}
                className="w-full py-3 rounded-xl font-semibold bg-[#007aff] text-white hover:bg-[#0066cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
              </button>
            </div>
          )}

          {/* Step 2: Card Info */}
          {step === 'card' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-[#007aff] border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-white/50 mt-2">Загрузка...</p>
                </div>
              ) : (
                <>
                  {/* Amount to pay */}
                  <div className="bg-[#007aff]/10 border border-[#007aff]/20 rounded-xl p-4 text-center">
                    <p className="text-white/70 text-sm mb-1">Сумма к оплате</p>
                    <p className="text-3xl font-bold text-white">{getRubAmount()} ₽</p>
                    <p className="text-sm text-white/50 mt-1">≈ {getTonAmount()} TON</p>
                  </div>

                  {/* Card details */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Номер карты</span>
                        <button
                          onClick={() => handleCopy(cardNumber.replace(/\s/g, ''))}
                          className="text-[#007aff] hover:text-[#0066cc] transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-white font-mono text-lg">{cardNumber}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <span className="text-white/70 text-sm block mb-2">Получатель</span>
                      <p className="text-white font-medium">{cardHolder}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <span className="text-white/70 text-sm block mb-2">Банк</span>
                      <p className="text-white font-medium">{cardBank}</p>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-200">
                        <p className="font-semibold mb-1">Внимание:</p>
                        <ul className="text-yellow-200/80 space-y-1 list-disc list-inside">
                          <li>Переведите точную сумму: {getRubAmount()} ₽</li>
                          <li>В комментарии укажите ваш Telegram ID</li>
                          <li>После перевода нажмите "Я оплатил"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('amount')}
                      className="flex-1 py-3 rounded-xl font-semibold bg-white/5 text-white hover:bg-white/10 transition-colors"
                    >
                      Назад
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      Я оплатил
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CardDepositSheet;
