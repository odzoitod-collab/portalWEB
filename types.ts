export interface NFT {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  currency: 'TON' | 'USDT';
  image: string;
  owner: string;
  verified?: boolean;
  views: number;
  bids: number;
  // New fields for filtering
  collection?: string;
  model?: string;
  backdrop?: string;
  origin?: 'gift' | 'purchase'; // Added for Gifts view filtering
}

export enum ViewState {
  STORE = 'STORE',
  GIFTS = 'GIFTS',
  SEASON = 'SEASON',
  PROFILE = 'PROFILE',
  NFT_DETAIL = 'NFT_DETAIL',
  CREATE = 'CREATE'
}

export interface User {
  address: string;
  balance: number;
  username: string;
  avatar: string;
  totalVolume: number;
  bought: number;
  sold: number;
}

export interface Transaction {
  id: number;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  title: string;
  date: string;
  amount: string;
  timestamp: number;
  nft_id?: string;
  nft_title?: string;
}