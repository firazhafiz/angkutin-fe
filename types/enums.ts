export enum UserRole {
  USER = "user",
  COURIER = "courier",
  ADMIN = "admin",
}

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  IN_PROGRESS = "in_progress",
  TRIAGE = "triage",
  WAITING_PAYMENT = "waiting_payment",
  PAID = "paid",
  DELIVERING = "delivering",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum VehicleType {
  MOTOR = "motor",
  PICKUP = "pickup",
  TRUCK_SMALL = "truck_small",
  TRUCK_LARGE = "truck_large",
}

export enum PaymentMethod {
  WALLET = "wallet",
  QRIS = "qris",
}

export enum WasteCategory {
  MUTU = "mutu", // Recyclable / valuable waste
  RESIDU = "residu", // Non-recyclable / residual waste
}

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
  WITHDRAWAL = "withdrawal",
  COMMISSION = "commission",
}

export enum CancellationReason {
  VEHICLE_CAPACITY = "vehicle_capacity", // Auto re-assign
  FAKE_ORDER = "fake_order", // Pure cancel
  WRONG_ADDRESS = "wrong_address", // Pure cancel
  USER_REQUEST = "user_request",
}
