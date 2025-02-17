import apiClient from "@/utils/apiClient";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CartItem {
  id: string; // or number, depending on your data structure
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  customerEmail: string;
  customerPhone: string;
  address: string;
  subTotal: number;
  deliveryCharge: number;
  items: {
    productId: string; // or number
    productName: string;
    price: number;
    quantity: number;
  }[];
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: OrderData) => void;
  totalPrice: number;
  cartItems: CartItem[];
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  totalPrice,
  cartItems,
}) => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState([]);

  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      const response = await apiClient.get("/delivery-charges"); // Adjust the API endpoint as needed
      if (response.data) {
        setDeliveryCharges(response.data);
      }
    };

    fetchDeliveryCharges();
  }, []);

  const handleSubmit = () => {
    // Validation logic
    if (!customerEmail) {
      alert("Please enter your email.");
      return;
    }

    if (!customerPhone) {
      alert("Please enter your phone number.");
      return;
    }

    if (!address) {
      alert("Please enter your address.");
      return;
    }

    const deliveryChargeElement = document.querySelector(
      "input[name='deliveryCharge']:checked"
    );

    const deliveryChargeAmount = parseInt(
      (deliveryChargeElement as HTMLInputElement).value
    );

    if (!deliveryChargeAmount) {
      toast.error("Please select a delivery charge.");
      return;
    }

    // console.log(deliveryChargeAmount);

    // Proceed with form submission
    const orderData = {
      customerEmail,
      customerPhone,
      address,
      subTotal: totalPrice,
      deliveryCharge: deliveryChargeAmount,
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    onSubmit(orderData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Place Your Order</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required={true}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              required={true}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              required={true}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          {/* Delivery Charge Options */}
          <div>
            <p className="text-sm font-medium">Select Delivery Option</p>
            <div className="flex items-center space-x-4">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                deliveryCharges.map((deliveryCharge: any, index: number) => (
                  <div key={deliveryCharge?.id}>
                    <input
                      type="radio"
                      id={deliveryCharge?.id}
                      name="deliveryCharge"
                      value={deliveryCharge?.amount}
                      defaultChecked={index === 0}
                      className="mr-2"
                    />
                    <label htmlFor={deliveryCharge?.id} className="text-sm">
                      {deliveryCharge?.type === "INSIDE_DHAKA"
                        ? "Inside Dhaka"
                        : "Outside Dhaka"}{" "}
                      - {deliveryCharge?.amount}
                    </label>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primaryColor text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
