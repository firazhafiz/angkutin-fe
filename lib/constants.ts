import { VehicleType } from "@/types/enums";

// SLA timeout for payment (in seconds)
export const PAYMENT_SLA_TIMEOUT = 600; // 10 minutes

// Order acceptance timeout for courier (in seconds)
export const ORDER_ACCEPT_TIMEOUT = 30;

// Vehicle types with display info
export const VEHICLE_OPTIONS = [
  { type: VehicleType.MOTOR, label: "Motor", maxVolume: 50, icon: "bike" },
  { type: VehicleType.PICKUP, label: "Pickup", maxVolume: 500, icon: "truck" },
  { type: VehicleType.TRUCK_SMALL, label: "Truk Kecil", maxVolume: 2000, icon: "truck" },
  { type: VehicleType.TRUCK_LARGE, label: "Truk Besar", maxVolume: 5000, icon: "truck" },
];

// Address tag options
export const ADDRESS_TAGS = ["Rumah", "Kos", "Kantor", "Lainnya"];

// Withdrawal provider options
export const WITHDRAWAL_PROVIDERS = ["DANA", "ShopeePay", "GoPay", "OVO", "Bank Transfer"];

// Map default center (Jakarta)
export const MAP_DEFAULT_CENTER = { lat: -6.2088, lng: 106.8456 };
export const MAP_DEFAULT_ZOOM = 13;
