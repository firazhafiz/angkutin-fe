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

// Withdrawal
export interface WithdrawRequest {
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  paymentAccountId: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";
  externalId: string | null;
  failureReason: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawResponse {
  status: string;
  message: string;
  data: Withdrawal;
}

// Transactions
export interface WalletTransaction {
  id: string;
  walletId: string;
  type: "DEBIT" | "CREDIT";
  amount: number;
  referenceType: string;
  referenceId: string;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";
  description: string;
  createdAt: string;
}

export interface WalletTransactionsResponse {
  status: string;
  message: string;
  data: WalletTransaction[];
}
