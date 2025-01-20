export interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
