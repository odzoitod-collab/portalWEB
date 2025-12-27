import React, { useState, useEffect } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { getSupportUsername } from '../services/supabaseClient';

interface WithdrawSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

const WithdrawSheet: React.FC<WithdrawSheetProps> = ({ isOpen, onClose, balance }) => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [step, setStep] = useState<'amount' | 'card'>('amount');
  const [supportUsername, setSupportUsername] = useState<string>('your_support_username');

  // Курс: 1 TON = 300 RUB
  const TON_TO_RUB_RATE = 300;

  useEffect(() => {
    const loadSupportUsername = async () => {
      try {
        const username = await getSupportUsername();
        setSupportUsername(username);
      } catch (error) {
        console.error('Error loading support username:', error);
      }
    };

    if (isOpen) {
      loadSupportUsername();
    }
  }, [isOpen]);

  const getTonAmount = () => {
    return parseFloat(amount) || 0;
  };

  const getRubAmount = () => {
    return (getTonAmount() * TON_TO_RUB_RATE).toFixed(0);
  };

  const handleNext = () => {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('❌ Введите корректную сумму');
      return;
    }

    if (amountNum < 1) {
      alert('❌ Минимальная сумма вывода: 1 TON');
      return;
    }

    if (amountNum > balance) {
      alert(`❌ Недостаточно средств!\n\nВаш баланс: ${balance.toFixed(2)} TON`);
      return;
    }

    setStep('card');
  };

  const handleWithdraw = () => {
    // Валидация номера карты
    const digits = cardNumber.replace(/\s/g, '').replace(/-/g, '');
    
    if (!digits || digits.length < 13) {
      alert('❌ Введите корректный номер карты');
      return;
    }

    // Показываем сообщение
    alert(
      '⚠️ Внимание\n\n' +
      'Вывод возможен только на те же реквизиты, с которых проходило пополнение.'
    );

    // Закрываем окно
    handleClose();
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setCardNumber('');
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
              {step === 'amount' ? 'Вывод средств' : 'Реквизиты карты'}
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
              {/* Balance */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/70 text-sm mb-1">Доступно для вывода</p>
                <p className="text-2xl font-bold text-white">{balance.toFixed(2)} TON</p>
                <p className="text-sm text-white/50 mt-1">≈ {(balance * TON_TO_RUB_RATE).toFixed(0)} ₽</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Сумма вывода (TON)
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max={balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007aff] transition-colors text-lg font-semibold"
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-2">
                  <span>Минимум: 1 TON</span>
                  <span>Максимум: {balance.toFixed(2)} TON</span>
                </div>
                {amount && parseFloat(amount) >= 1 && (
                  <div className="mt-2 text-center">
                    <span className="text-sm text-white/70">Получите: </span>
                    <span className="text-lg font-bold text-green-400">{getRubAmount()} ₽</span>
                    <span className="text-xs text-white/50 ml-2">(курс: 1 TON = {TON_TO_RUB_RATE} ₽)</span>
                  </div>
                )}
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 5, 10].filter(val => val <= balance).map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    {val} TON
                  </button>
                ))}
              </div>



              <button
                onClick={handleNext}
                disabled={!amount || parseFloat(amount) < 1}
                className="w-full py-3 rounded-xl font-semibold bg-[#007aff] text-white hover:bg-[#0066cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
              </button>
            </div>
          )}

          {/* Step 2: Card */}
          {step === 'card' && (
            <div className="space-y-6">
              {/* Amount summary */}
              <div className="bg-[#007aff]/10 border border-[#007aff]/20 rounded-xl p-4 text-center">
                <p className="text-white/70 text-sm mb-1">Сумма вывода</p>
                <p className="text-3xl font-bold text-white">{getTonAmount()} TON</p>
                <p className="text-sm text-white/50 mt-1">≈ {getRubAmount()} ₽</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Номер карты для пополнения
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      // Форматирование номера карты
                      const value = e.target.value.replace(/\s/g, '');
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setCardNumber(formatted);
                    }}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007aff] transition-colors font-mono"
                  />
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Укажите номер карты, с которой вы пополняли баланс
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-semibold mb-1">Внимание:</p>
                    <p className="text-yellow-200/80">
                      Вывод возможен только на те же реквизиты, с которых проходило пополнение.
                    </p>
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
                  onClick={handleWithdraw}
                  disabled={!cardNumber || cardNumber.replace(/\s/g, '').length < 13}
                  className="flex-1 py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Вывести
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WithdrawSheet;
