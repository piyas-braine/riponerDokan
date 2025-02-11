"use client";

type OrderItem = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryCharge: number;
  subTotal: number;
  trackingId?: string;
};

const OrderTrackingTable = ({
  id,
  status,
  items,
  totalAmount,
  deliveryCharge,
  subTotal,
  trackingId,
}: Order) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Order Status */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900">Order #{id}</h2>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            {status}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-700">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left p-3 font-semibold">Product</th>
                <th className="text-right p-3 font-semibold">Price</th>
                <th className="text-right p-3 font-semibold">Quantity</th>
                <th className="text-right p-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.productName}</td>
                  <td className="text-right p-3">BDT. {Number(item?.price)?.toFixed(2)}</td>
                  <td className="text-right p-3">{item?.quantity}</td>
                  <td className="text-right p-3 font-medium text-black">
                    BDT{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">BDT. {totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span className="font-medium">BDT. {deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-4 text-lg font-semibold text-black">
            <span>Total</span>
            <span>BDT. {subTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tracking Info */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Tracking Information
        </h2>
        {trackingId ? (
          <p className="text-gray-800">
            Tracking ID: <span className="font-medium">{trackingId}</span>
          </p>
        ) : (
          <p className="text-gray-500">
            Tracking information will be available once the order is shipped.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingTable;