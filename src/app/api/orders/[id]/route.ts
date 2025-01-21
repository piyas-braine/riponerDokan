import { deleteOrder, getOrder, updateOrder } from "@/controllers/orderController";

export const GET = getOrder;
export const PATCH = updateOrder;
export const DELETE = deleteOrder;