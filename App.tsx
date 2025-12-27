import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import StoreView from './components/StoreView';
import ProfileView from './components/ProfileView';
import GiftsView from './components/GiftsView';
import SeasonView from './components/SeasonView';
import WalletSheet from './components/WalletSheet';
import SettingsSheet from './components/SettingsSheet';
import HistorySheet from './components/HistorySheet';
import NFTDetail from './components/NFTDetail';
import CreateListing from './components/CreateListing';
import CardDepositSheet from './components/CardDepositSheet';
import WithdrawSheet from './components/WithdrawSheet';
import { MOCK_NFTS, MOCK_USER } from './constants';
import { NFT, ViewState, User, Transaction } from './types';
import { 
  getOrCreateUser, 
  getUser, 
  updateUserBalance, 
  subscribeToBalanceChanges, 
  createNftListing, 
  createTransaction, 
  getUserTransactions, 
  subscribeToTransactions, 
  DbTransaction,
  addUserNft,
  getUserNfts,
  removeUserNft,
  subscribeToUserNfts,
  DbUserNft,
  createDepositRequest,
  userOwnsNft
} from './services/supabaseClient';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface AppProps {
  telegramUser?: TelegramUser | null;
}

const App: React.FC<AppProps> = ({ telegramUser }) => {
  const [view, setView] = useState<ViewState>(ViewState.PROFILE); // Начинаем с профиля
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  
  // Инициализируем пользователя данными из Telegram
  const initUser = (): User => {
    if (telegramUser) {
      return {
        address: `EQ${telegramUser.id}`,
        balance: 0,
        username: telegramUser.username || telegramUser.first_name,
        avatar: telegramUser.photo_url || 'https://picsum.photos/200/200?random=user',
        totalVolume: 0,
        bought: 0,
        sold: 0
      };
    }
    return { ...MOCK_USER, balance: 0, bought: 0, sold: 0 };
  };
  
  // State
  const [nfts, setNfts] = useState<NFT[]>(MOCK_NFTS);
  const [user, setUser] = useState<User>(initUser());
  const [history, setHistory] = useState<Transaction[]>([]);

  // Загрузка баланса, истории и NFT из Supabase при монтировании
  useEffect(() => {
    const loadUserData = async () => {
      if (!telegramUser) {
        setIsLoadingBalance(false);
        return;
      }

      try {
        // Получаем или создаем пользователя в Supabase
        const dbUser = await getOrCreateUser(
          telegramUser.id,
          telegramUser.username,
          telegramUser.first_name,
          telegramUser.photo_url
        );

        if (dbUser) {
          // Обновляем баланс из базы данных
          setUser(prev => ({
            ...prev,
            balance: dbUser.balance || 0
          }));
        }

        // Загружаем историю транзакций
        const transactions = await getUserTransactions(telegramUser.id);
        const formattedHistory = transactions.map(dbTxToTransaction);
        setHistory(formattedHistory);

        // Загружаем NFT пользователя
        const userNfts = await getUserNfts(telegramUser.id);
        const ownedNfts = userNfts.map(dbNftToNft);
        
        // Обновляем список NFT: добавляем купленные к существующим
        setNfts(prev => {
          const allNfts = [...prev];
          ownedNfts.forEach(ownedNft => {
            const existingIndex = allNfts.findIndex(n => n.id === ownedNft.id);
            if (existingIndex >= 0) {
              // Обновляем владельца существующего NFT
              allNfts[existingIndex] = ownedNft;
            } else {
              // Добавляем новый NFT
              allNfts.push(ownedNft);
            }
          });
          return allNfts;
        });

        // Рассчитываем статистику из транзакций
        const buyTransactions = transactions.filter(t => t.type === 'buy');
        const sellTransactions = transactions.filter(t => t.type === 'sell');
        
        const totalBought = buyTransactions.length;
        const totalSold = sellTransactions.length;
        const totalVolume = [
          ...buyTransactions.map(t => t.amount),
          ...sellTransactions.map(t => t.amount)
        ].reduce((sum, amount) => sum + amount, 0);

        setUser(prev => ({
          ...prev,
          bought: totalBought,
          sold: totalSold,
          totalVolume: totalVolume
        }));

        console.log(`✅ Loaded ${userNfts.length} NFTs, ${transactions.length} transactions from Supabase`);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadUserData();
  }, [telegramUser]);

  // Подписка на изменения баланса, транзакций и NFT в реальном времени
  useEffect(() => {
    if (!telegramUser) return;

    const unsubscribeBalance = subscribeToBalanceChanges(
      telegramUser.id,
      (newBalance) => {
        setUser(prev => ({
          ...prev,
          balance: newBalance
        }));
      }
    );

    const unsubscribeTransactions = subscribeToTransactions(
      telegramUser.id,
      (dbTransaction) => {
        const newTransaction = dbTxToTransaction(dbTransaction);
        setHistory(prev => [newTransaction, ...prev]);
      }
    );

    const unsubscribeNfts = subscribeToUserNfts(
      telegramUser.id,
      (dbNft) => {
        // Новый NFT добавлен
        const newNft = dbNftToNft(dbNft);
        setNfts(prev => {
          const existingIndex = prev.findIndex(n => n.id === newNft.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newNft;
            return updated;
          }
          return [newNft, ...prev];
        });
        console.log(`✅ NFT added via Realtime: ${dbNft.nft_title}`);
      },
      (nftId) => {
        // NFT удален (продан)
        setNfts(prev => prev.map(n => 
          n.id === nftId ? { ...n, owner: '' } : n
        ));
        console.log(`✅ NFT removed via Realtime: ${nftId}`);
      }
    );

    return () => {
      unsubscribeBalance();
      unsubscribeTransactions();
      unsubscribeNfts();
    };
  }, [telegramUser]);

  // Конвертация транзакции из БД в формат UI
  const dbTxToTransaction = (dbTx: DbTransaction): Transaction => {
    const date = new Date(dbTx.created_at);
    const dateStr = date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const sign = dbTx.type === 'deposit' || dbTx.type === 'sell' ? '+' : '-';
    const amount = `${sign}${dbTx.amount} TON`;
    
    return {
      id: dbTx.id,
      type: dbTx.type,
      title: dbTx.title,
      date: dateStr,
      amount,
      timestamp: date.getTime(),
      nft_id: dbTx.nft_id || undefined,
      nft_title: dbTx.nft_title || undefined
    };
  };

  // Конвертация NFT из БД в формат UI
  const dbNftToNft = (dbNft: DbUserNft): NFT => {
    return {
      id: dbNft.nft_id,
      title: dbNft.nft_title,
      subtitle: dbNft.nft_subtitle || undefined,
      description: dbNft.nft_description || '',
      price: dbNft.nft_price,
      currency: 'TON' as const,
      image: dbNft.nft_image,
      owner: `EQ${dbNft.user_id}`,
      verified: true,
      views: 0,
      bids: 0,
      collection: dbNft.nft_collection || undefined,
      model: dbNft.nft_model || undefined,
      backdrop: dbNft.nft_backdrop || undefined,
      origin: dbNft.origin
    };
  };
  
  // UI State
  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [isCardDepositOpen, setIsCardDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Navigation Handlers
  const handleNftClick = (nft: NFT) => {
    setSelectedNft(nft);
    setView(ViewState.NFT_DETAIL);
  };

  const handleBackFromDetail = () => {
    setView(ViewState.STORE);
    setSelectedNft(null);
  };

  // Logic Handlers
  const addHistoryItem = async (
    type: Transaction['type'], 
    title: string, 
    amountVal: number,
    nftId?: string,
    nftTitle?: string
  ) => {
    // Сохраняем в Supabase
    if (telegramUser) {
      const dbTransaction = await createTransaction(
        telegramUser.id,
        type,
        title,
        amountVal,
        nftId,
        nftTitle
      );
      
      if (dbTransaction) {
        // Транзакция будет добавлена через Realtime подписку
        console.log(`✅ Transaction saved: ${title}`);
      } else {
        console.error('Failed to save transaction');
        // Добавляем локально если не удалось сохранить
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'short', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const sign = type === 'deposit' || type === 'sell' ? '+' : (amountVal > 0 ? '-' : '');
        
        const newTx: Transaction = {
          id: Date.now(),
          type,
          title,
          date: dateStr,
          amount: `${sign}${amountVal} TON`,
          timestamp: now.getTime(),
          nft_id: nftId,
          nft_title: nftTitle
        };
        setHistory(prev => [newTx, ...prev]);
      }
    }
  };

  const handleDeposit = async () => {
    const amount = 100; // Simulation amount
    const newBalance = parseFloat((user.balance + amount).toFixed(2));
    
    try {
      // Обновляем локально
      setUser(prev => ({ ...prev, balance: newBalance }));
      
      // Сохраняем в Supabase
      if (telegramUser) {
        const result = await updateUserBalance(telegramUser.id, newBalance);
        if (result) {
          console.log(`✅ Balance updated: ${user.balance} → ${newBalance} TON`);
          // Добавляем транзакцию
          await addHistoryItem('deposit', 'Пополнение TON', amount);
        } else {
          console.error('Failed to update balance in Supabase');
          alert('⚠️ Баланс обновлен локально, но возможны проблемы с синхронизацией');
        }
      }
    } catch (error) {
      console.error('Error in handleDeposit:', error);
      alert('❌ Ошибка при пополнении баланса');
      // Откатываем изменения
      setUser(prev => ({ ...prev, balance: user.balance }));
    }
  };

  const handleCardDeposit = async (amountTon: number, amountRub: number) => {
    if (!telegramUser) {
      alert('❌ Ошибка: не удалось определить пользователя');
      return;
    }

    try {
      // Создаем заявку на пополнение
      const request = await createDepositRequest(
        telegramUser.id,
        amountTon,
        amountRub
      );

      if (request) {
        alert(
          `✅ Заявка на пополнение отправлена!\n\n` +
          `Сумма: ${amountTon} TON (${amountRub}₽)\n\n` +
          `Пополнение будет подтверждено после проверки платежа.\n\n` +
          `Обычно это занимает 1-5 минут.`
        );
        
        console.log(`✅ Deposit request created: ${amountTon} TON (${amountRub}₽)`);
      } else {
        alert('❌ Ошибка при создании заявки. Попробуйте снова.');
      }
    } catch (error) {
      console.error('Error in handleCardDeposit:', error);
      alert('❌ Ошибка при создании заявки на пополнение.');
    }
  };

  const handlePublish = async (newNft: NFT) => {
    const nftWithUser = { ...newNft, owner: user.address };
    setNfts([nftWithUser, ...nfts]);
    await addHistoryItem('sell', `Листинг: ${newNft.title}`, 0, newNft.id, newNft.title);
    setView(ViewState.STORE);
  };

  const handleBuy = async (nft: NFT) => {
      // Проверка баланса
      if (user.balance < nft.price) {
          alert("❌ Недостаточно средств!\n\nТребуется: " + nft.price + " TON\nВаш баланс: " + user.balance.toFixed(2) + " TON\n\nПополните кошелек.");
          setIsWalletSheetOpen(true);
          return;
      }

      // Проверка что NFT еще не куплен
      if (nft.owner === user.address) {
          alert("❌ Вы уже владеете этим NFT!");
          return;
      }

      const newBalance = parseFloat((user.balance - nft.price).toFixed(2));

      try {
          // Deduct balance and update stats
          setUser(prev => ({ 
              ...prev, 
              balance: newBalance,
              bought: prev.bought + 1,
              totalVolume: parseFloat((prev.totalVolume + nft.price).toFixed(2))
          }));

          // Transfer ownership locally
          setNfts(prev => prev.map(n => n.id === nft.id ? { ...n, owner: user.address, origin: 'purchase' } : n));
          
          // Сохраняем в Supabase
          if (telegramUser) {
            // Обновляем баланс
            const result = await updateUserBalance(telegramUser.id, newBalance);
            if (!result) {
              console.error('Failed to update balance in Supabase');
            }

            // Добавляем NFT в коллекцию пользователя
            const addedNft = await addUserNft(
              telegramUser.id,
              nft.id,
              nft.title,
              nft.image,
              nft.price,
              nft.subtitle,
              nft.description,
              nft.collection,
              nft.model,
              nft.backdrop,
              'purchase'
            );

            if (addedNft) {
              console.log(`✅ NFT "${nft.title}" saved to Supabase`);
            } else {
              console.error('Failed to save NFT to Supabase');
            }
          }

          // Add to history
          await addHistoryItem('buy', nft.title, nft.price, nft.id, nft.title);

          // Close detail view or show success
          alert(`✅ Успешно!\n\nВы купили "${nft.title}" за ${nft.price} TON\n\nНовый баланс: ${newBalance.toFixed(2)} TON`);
          setView(ViewState.GIFTS);
          setSelectedNft(null);
      } catch (error) {
          console.error('Error in handleBuy:', error);
          alert('❌ Ошибка при покупке. Попробуйте снова.');
          // Откатываем изменения
          setUser(prev => ({ 
              ...prev, 
              balance: user.balance,
              bought: prev.bought - 1
          }));
      }
  };

  const handleSellNFT = async (nft: NFT, price: number) => {
    if (!telegramUser) {
      alert('❌ Ошибка: не удалось определить пользователя');
      return;
    }

    // Проверка минимальной цены
    if (price < 1) {
      alert('❌ Минимальная цена: 1 TON');
      return;
    }

    // Проверка максимальной цены
    if (price > 1000000) {
      alert('❌ Максимальная цена: 1,000,000 TON');
      return;
    }

    try {
      // Проверяем владение NFT через БД
      const ownsNft = await userOwnsNft(telegramUser.id, nft.id);
      
      if (!ownsNft) {
        alert('❌ Вы не владеете этим NFT или он уже выставлен на продажу!');
        return;
      }

      // Создаем листинг в Supabase
      const listing = await createNftListing(
        telegramUser.id,
        nft.id,
        nft.title,
        nft.image,
        price
      );

      if (listing) {
        alert(
          `✅ Предложение отправлено!\n\n` +
          `NFT: "${nft.title}"\n` +
          `Цена: ${price} TON\n\n` +
          `После одобрения:\n` +
          `• Деньги будут зачислены на ваш баланс\n` +
          `• NFT будет удален из вашего портфеля\n` +
          `• Транзакция появится в истории`
        );
        
        console.log(`📝 Created listing: ${nft.title} for ${price} TON`);
        setView(ViewState.GIFTS);
      } else {
        alert('❌ Ошибка при создании листинга. Попробуйте снова.');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('❌ Ошибка при создании листинга. Проверьте подключение к интернету.');
    }
  };

  // Filter owned NFTs for Gifts View
  const myGifts = nfts.filter(n => n.owner === user.address);

  // Filter NFTs for Store View - exclude owned NFTs
  const storeNfts = nfts.filter(n => n.owner !== user.address);

  const renderContent = () => {
    switch (view) {
      case ViewState.STORE:
        return (
          <StoreView 
            nfts={storeNfts} 
            onNftClick={handleNftClick} 
            userBalance={user.balance}
            onOpenWallet={() => setIsWalletSheetOpen(true)}
          />
        );
      case ViewState.GIFTS:
        return (
           <GiftsView 
             nfts={myGifts} 
             onNftClick={handleNftClick} 
             userBalance={user.balance}
             onOpenWallet={() => setIsWalletSheetOpen(true)}
           />
        );
      case ViewState.SEASON:
        return (
            <SeasonView 
                userBalance={user.balance}
                onOpenWallet={() => setIsWalletSheetOpen(true)}
            />
        );
      case ViewState.PROFILE:
        return (
          <ProfileView 
             user={user} 
             onOpenWalletSheet={() => setIsWalletSheetOpen(true)}
             onOpenSettings={() => setIsSettingsSheetOpen(true)}
          />
        );
      case ViewState.NFT_DETAIL:
        return selectedNft ? (
          <NFTDetail 
            nft={selectedNft} 
            onBack={handleBackFromDetail} 
            onBuy={handleBuy} 
            userBalance={user.balance}
            isOwner={selectedNft.owner === user.address}
            onOpenWallet={() => setIsWalletSheetOpen(true)}
            onSellNFT={handleSellNFT}
          />
        ) : null;
      case ViewState.CREATE:
        return <CreateListing onPublish={handlePublish} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text font-sans">
      <main className="max-w-md mx-auto min-h-screen bg-[#000000] relative shadow-2xl overflow-hidden">
        {renderContent()}
        
        {view !== ViewState.NFT_DETAIL && (
            <BottomNav currentView={view} setView={setView} />
        )}

        <WalletSheet 
            isOpen={isWalletSheetOpen} 
            onClose={() => setIsWalletSheetOpen(false)}
            balance={user.balance}
            history={history}
            onDeposit={handleDeposit}
            onCardDeposit={() => {
              setIsWalletSheetOpen(false);
              setIsCardDepositOpen(true);
            }}
            onWithdraw={() => {
              setIsWalletSheetOpen(false);
              setIsWithdrawOpen(true);
            }}
        />
        
        <CardDepositSheet 
            isOpen={isCardDepositOpen}
            onClose={() => setIsCardDepositOpen(false)}
            onConfirm={handleCardDeposit}
        />

        <WithdrawSheet 
            isOpen={isWithdrawOpen}
            onClose={() => setIsWithdrawOpen(false)}
            balance={user.balance}
        />
        
        <SettingsSheet 
            isOpen={isSettingsSheetOpen} 
            onClose={() => setIsSettingsSheetOpen(false)}
        />

        <HistorySheet 
            isOpen={isHistorySheetOpen}
            onClose={() => setIsHistorySheetOpen(false)}
            history={history}
        />
      </main>
    </div>
  );
};

export default App;