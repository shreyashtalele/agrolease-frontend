export interface Equipment {
  _id: string;
  title: string;
  description: string;
  category: string;
  rentalPricePerDay: number;
  securityDeposit: number;
  quantity: number;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  specifications: {
    brand?: string;
    model?: string;
    modelYear?: number;
    powerSource?: string;
    horsepower?: number;
    hours?: number;
  };
  images: string[];
  status: "available" | "booked" | "pending";
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isVerified: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFilters {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface CreateEquipmentRequest {
  title: string;
  description: string;
  category: string;
  rentalPricePerDay: number;
  securityDeposit: number;
  quantity: number;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  specifications: {
    brand?: string;
    model?: string;
    modelYear?: number;
    powerSource?: string;
    horsepower?: number;
  };
  images?: File[];
}

export interface UpdateEquipmentRequest {
  title?: string;
  description?: string;
  rentalPricePerDay?: number;
  securityDeposit?: number;
  quantity?: number;
  location?: {
    city: string;
    state: string;
    pincode: string;
  };
  specifications?: {
    brand?: string;
    model?: string;
    modelYear?: number;
    powerSource?: string;
    horsepower?: number;
    hours?: number;
  };
  images?: string[];
  status?: "available" | "booked" | "pending";
}

export interface AvailabilityResponse {
  available: boolean;
  bookedDates?: string[];
}
