import api from "@/lib/api";
import {
  WalletBalanceResponse,
  WalletAccountsResponse,
  WalletAccountResponse,
  WalletAccount,
} from "@/types/wallet";

export const walletService = {
  // Get in-app wallet balance
  async getBalance(): Promise<WalletBalanceResponse> {
    const response = await api.get<WalletBalanceResponse>("/wallet/balance");
    return response.data;
  },

  // Get bank accounts
  async getAccounts(): Promise<WalletAccountsResponse> {
    const response = await api.get<WalletAccountsResponse>("/wallet/accounts");
    return response.data;
  },

  // Create bank account
  async createAccount(data: {
    providerName: string;
    accountNumber: string;
    accountName: string;
    isDefault: boolean;
  }): Promise<WalletAccountResponse> {
    const response = await api.post<WalletAccountResponse>(
      "/wallet/accounts",
      data,
    );
    return response.data;
  },

  // Delete bank account
  async deleteAccount(id: string): Promise<WalletAccountResponse> {
    const response = await api.delete<WalletAccountResponse>(
      `/wallet/accounts/${id}`,
    );
    return response.data;
  },

  // Set account as default
  async setDefaultAccount(id: string): Promise<WalletAccountResponse> {
    const response = await api.patch<WalletAccountResponse>(
      `/wallet/accounts/${id}`,
      { isDefault: true },
    );
    return response.data;
  },

  // Update bank account
  async updateAccount({
    id,
    data,
  }: {
    id: string;
    data: Partial<{
      providerName: string;
      accountNumber: string;
      accountName: string;
      isDefault: boolean;
    }>;
  }): Promise<WalletAccountResponse> {
    const response = await api.patch<WalletAccountResponse>(
      `/wallet/accounts/${id}`,
      data,
    );
    return response.data;
  },
};
