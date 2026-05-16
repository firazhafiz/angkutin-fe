import api from "@/lib/api";

export const paymentService = {
  /** Pay with wallet balance — POST /api/payments/wallet */
  async payWithWallet(orderId: string) {
    const response = await api.post("/payments/wallet", { orderId });
    return response.data;
  },

  /** Generate QRIS payment (Xendit) — POST /api/payments/qris */
  async createQRIS(orderId: string) {
    const response = await api.post("/payments/qris", { orderId });
    return response.data;
  },

  /** Check payment status — GET /api/payments/:id/status */
  async getPaymentStatus(paymentId: string) {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  },
};
