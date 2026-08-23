export interface Booking {
  _id: string;
  equipmentId: {
    _id: string;
    title: string;
    rentalPricePerDay: number;
    images: string[];
  };
  renterId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bookingDateStart: string;
  bookingDateEnd: string;
  deliveryType: "pickup" | "delivery";
  notes?: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  equipmentId: string;
  bookingDateStart: string;
  bookingDateEnd: string;
  deliveryType: "pickup" | "delivery";
  notes?: string;
}

export interface BookingFilters {
  type?: "renter" | "owner";
  status?: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  page?: number;
  limit?: number;
}
