export interface Order {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  id: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
