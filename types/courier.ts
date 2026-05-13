export interface CourierApiResponse {
  id: string;
  userId: string;
  vehicleType: string;
  vehiclePlate: string;
  isOnline: boolean;
  currentLat: number | null;
  currentLng: number | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    photoUrl: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CourierUpdateStatusResponse {
  id: string;
  userId: string;
  vehicleType: string;
  vehiclePlate: string;
  isOnline: boolean;
  currentLat: number | null;
  currentLng: number | null;
}
