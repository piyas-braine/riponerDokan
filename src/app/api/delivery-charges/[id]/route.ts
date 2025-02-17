import { deleteDeliveryCharge, getDeliveryCharge, updateDeliveryCharge } from "@/controllers/deliveryChargeController";

export const GET = getDeliveryCharge;
export const PATCH = updateDeliveryCharge;
export const DELETE = deleteDeliveryCharge;