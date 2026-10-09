export interface Store {
  id: string;
  name: string;
  tradeName: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  openingHours: string;
  isOpenNow: boolean;
  distanceKm?: number;
  availablePickupDays: string[];
  timeSlots: string[];
  pickupInstructions: string;
}
