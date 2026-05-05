import api from "@/lib/api";
import { WalletBalanceResponse } from "@/types/wallet";

export const walletService = {
  // Get in-app wallet balance
  async getBalance(): Promise<WalletBalanceResponse> {
    const response = await api.get<WalletBalanceResponse>("/wallet/balance");
    return response.data;
  },
};
