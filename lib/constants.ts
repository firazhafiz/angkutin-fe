import { VehicleType } from "@/types/enums";

// SLA timeout for payment (in seconds)
export const PAYMENT_SLA_TIMEOUT = 600; // 10 minutes

// Order acceptance timeout for courier (in seconds)
export const ORDER_ACCEPT_TIMEOUT = 30;

// Vehicle types with display info
export const VEHICLE_OPTIONS = [
  { type: VehicleType.MOTOR, label: "Motor", maxVolume: 50, icon: "bike" },
  { type: VehicleType.PICKUP, label: "Pickup", maxVolume: 500, icon: "truck" },
  { type: VehicleType.TRUCK, label: "Truk", maxVolume: 2000, icon: "truck" },
];

// Address tag options
export const ADDRESS_TAGS = ["Rumah", "Kos", "Kantor", "Lainnya"];

// Withdrawal provider options
export const WITHDRAWAL_PROVIDERS = ["DANA", "ShopeePay", "GoPay", "OVO", "Bank Transfer"];

// Map default center (Surabaya)
export const MAP_DEFAULT_CENTER = { lat: -7.2575, lng: 112.7521 };
export const MAP_DEFAULT_ZOOM = 13;

/** Gudang Angkutin — Jl. Rungkut Industri No. 5, Surabaya */
export const ANGKUTIN_WAREHOUSE = {
  lat: -7.3283,
  lng: 112.7753,
  label: "Gudang Angkutin",
  address: "Jl. Rungkut Industri No. 5, Surabaya",
} as const;

/** Simulation animation speed (ms per polyline step) */
export const COURIER_ANIMATION_SPEED = 800;

/** Radius (in meters) to consider courier "arrived" at destination */
export const ARRIVAL_RADIUS_METERS = 500;
