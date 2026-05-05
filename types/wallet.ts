export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalanceResponse {
  status: string;
  message: string;
  data: Wallet;
}
