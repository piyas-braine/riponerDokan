import { addDeliveryCharge, getAllDeliveryCharges } from "@/controllers/deliveryChargeController";

export const GET = getAllDeliveryCharges;
export const POST = addDeliveryCharge;