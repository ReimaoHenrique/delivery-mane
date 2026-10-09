export type FulfillmentType = 'delivery' | 'pickup';

export interface Address {
  id: string;
  name?: string; // ex: "Casa", "Chácara", "Sítio do Churrasco"
  zipCode: string; // CEP
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  referencePoint?: string;
  isDefault?: boolean;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  fee: number;
  isExpress?: boolean;
  minOrderValue?: number;
}

export interface FulfillmentSelection {
  type: FulfillmentType;
  selectedAddress?: Address;
  selectedDeliveryOption?: DeliveryOption;
  selectedStoreId?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  pickupInstructions?: string;
  deliveryFee: number;
}
