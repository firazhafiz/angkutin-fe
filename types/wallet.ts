export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletAccount {
  id: string;
  userId: string;
  providerName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WalletBalanceResponse {
  status: string;
  message: string;
  data: Wallet;
}

export interface WalletAccountsResponse {
  status: string;
  message: string;
  data: WalletAccount[];
}

export interface WalletAccountResponse {
  status: string;
  message: string;
  data: WalletAccount;
}
