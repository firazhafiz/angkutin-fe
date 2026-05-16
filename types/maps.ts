import { PrismaDecimal } from "@/lib/decimal";

// ==================== COURIER LOCATION ====================
export interface CourierLocation {
  courierId: string;
  lat: number;
  lng: number;
  heading?: number;
  updatedAt?: string;
}

// ==================== TRACKING ====================
export interface TrackingPoint {
  lat: number;
  lng: number;
  heading?: number;
  timestamp: string;
}

// ==================== MAP MARKER ====================
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: "user" | "courier" | "destination" | "pickup";
  label?: string;
}

// ==================== ROUTE ====================
export interface RouteInfo {
  polyline: [number, number][]; // [lng, lat] pairs for Mapbox
  distanceKm: number;
  durationMinutes: number;
}

// ==================== RAW BE COORDINATE (Prisma Decimal) ====================
/** Raw coordinate fields as returned by BE (Prisma Decimal or plain number) */
export interface RawCoordinate {
  latitude: PrismaDecimal | number | null;
  longitude: PrismaDecimal | number | null;
}

export interface RawCourierCoordinate {
  currentLat: PrismaDecimal | number | null;
  currentLng: PrismaDecimal | number | null;
}
