"use client";
import apiClient from "@/utils/apiClient";
import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

interface DeliveryChargeFormInput {
  type: string;
  amount: string;
}

const Register = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryChargeFormInput>();

  const router = useRouter();

  const onSubmit: SubmitHandler<DeliveryChargeFormInput> = async (
    data: DeliveryChargeFormInput
  ) => {
    try {
      const response = await apiClient.post("/delivery-charges", data);
      if (response.data) {
        reset();
        toast.success(response.data.message || "Delivery charge added successfully");
        router.push("/admin/charges");
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Delivery charge add error");
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white w-full md:max-w-2xl p-4 sm:p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">
          Add New Delivery Charge
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Input */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Type</label>
            <select
              {...register("type", { required: "Type is required" })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.type
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            >
              <option value="INSIDE_DHAKA">Inside Dhaka</option>
              <option value="OUTSIDE_DHAKA">Outside Dhaka</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Email and Password Row */}
          <div className="mb-3 sm:flex sm:space-x-4">
            {/* Email Input */}
            <div className="w-full mb-3 sm:mb-0">
              <label className="block text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.amount
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
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
              Add Delivery Charge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
