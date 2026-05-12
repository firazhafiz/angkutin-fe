export enum UserRole {
  USER = "user",
  COURIER = "courier",
  ADMIN = "admin",
}

export enum OrderStatus {
  CREATED = "CREATED",
  MATCHED = "MATCHED",
  ON_GOING = "ON_GOING",
  ARRIVED = "ARRIVED",
  WEIGHING = "WEIGHING",
  WAITING_PAYMENT = "WAITING_PAYMENT",
  PICKED_UP = "PICKED_UP",
  DELIVERING = "DELIVERING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum VehicleType {
  MOTOR = "MOTOR",
  PICKUP = "PICKUP",
  TRUCK = "TRUCK",
}

export enum ScheduleType {
  INSTANT = "INSTANT",
  SCHEDULED = "SCHEDULED",
}

export enum PaymentMethod {
  WALLET = "wallet",
  QRIS = "qris",
  VA = "va",
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
  FAKE_ORDER = "fake_order", // Pure cancel
  WRONG_ADDRESS = "wrong_address", // Pure cancel
  USER_REQUEST = "user_request",
}
