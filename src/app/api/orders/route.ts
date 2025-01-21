import { createOrder, getAllOrders } from "@/controllers/orderController";

export const GET = getAllOrders;
export const POST = createOrder;