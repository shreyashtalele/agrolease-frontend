import { z } from "zod";

export const equipmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  rentalPricePerDay: z.number().positive("Price must be greater than 0"),
  securityDeposit: z.number().min(0, "Security deposit cannot be negative"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  location: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z
      .string()
      .regex(/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"),
  }),
  specifications: z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    modelYear: z.number().optional(),
    powerSource: z.string().optional(),
    horsepower: z.number().optional(),
    hours: z.number().optional(),
  }),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;
