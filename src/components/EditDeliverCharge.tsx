"use client";
import apiClient from "@/utils/apiClient";
import React from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

interface DeliveryChargeFormInput {
  amount: string;
}

const EditDeliveryCharge = ({
  id,
  amount,
  setIsEditModalOpen,
  fetchDeliveryCharges,
}: {
  id: string;
  amount: number;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchDeliveryCharges: () => Promise<void>;
}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryChargeFormInput>();

  const onSubmit: SubmitHandler<DeliveryChargeFormInput> = async (
    data: DeliveryChargeFormInput
  ) => {
    try {
      const response = await apiClient.patch(`/delivery-charges/${id}`, data);
      if (response.data) {
        setIsEditModalOpen(false);
        fetchDeliveryCharges();
        reset();
        toast.success(
          response.data.message || "Delivery charge updated successfully"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Delivery charge update error");
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white w-full md:max-w-2xl p-4 sm:p-6 rounded-lg shadow-lg relative z-50 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">
          Edit Delivery Charge
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3 sm:flex sm:space-x-4">
            {/* Email Input */}
            <div className="w-full mb-3 sm:mb-0">
              <label className="block text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                })}
                defaultValue={amount}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.amount
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                placeholder="Enter your email"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Update Delivery Charge
            </button>
          </div>
        </form>

        <button onClick={() => setIsEditModalOpen(false)} className="top-2 right-5 p-1.5 px-5 absolute bg-red-600 text-white rounded-md">Close</button>
      </div>
    </div>
  );
};

export default EditDeliveryCharge;
