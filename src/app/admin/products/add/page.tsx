"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/Providers/AuthContext";
import apiClient from "@/utils/apiClient";

type TAddProductForm = {
  name: string;
  price: number;
  stock: number;
  description: string;
  image: FileList; // To handle file uploads
};

const AddProductPage = () => {
  const { user } = useAuth(); // Assume this hook provides the logged-in user's ID
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddProductForm>();
  const router = useRouter();

  const onSubmit: SubmitHandler<TAddProductForm> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("userId", user?.id as string); // Automatically attach the user ID
    formData.append("description", data.description);

    if (data.image?.[0]) {
      formData.append("files", data.image[0]); // Add the first selected file
    }

    try {
      const response = await apiClient.post("/products", formData);

      if (response.data) {
        toast.success("Product added successfully!");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <main className="flex items-center justify-center h-full bg-gray-100">
      <div className="card shadow-lg p-4 max-w-4xl bg-white w-full rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add Product
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Product Name */}
          <div className="form-control col-span-1">
            <label className="label font-medium text-gray-700 text-base">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              {...register("name", { required: "Product name is required" })}
              className="input input-bordered w-full px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Product Price */}
          <div className="form-control col-span-1">
            <label className="label font-medium text-gray-700 text-base">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter price"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "Price must be greater than 0",
              })}
              className="input input-bordered w-full px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Product Stock */}
          <div className="form-control col-span-1">
            <label className="label font-medium text-gray-700 text-base">
              Stock
            </label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              {...register("stock", {
                required: "Stock is required",
                valueAsNumber: true,
                validate: (value) => value > 0 || "Stock must be at least 1",
              })}
              className="input input-bordered w-full px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div className="form-control col-span-1 lg:col-span-2">
            <label className="label font-medium text-gray-700 text-base">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              {...register("description", {
                required: "Description is required",
              })}
              className="textarea textarea-bordered w-full px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="form-control col-span-1 lg:col-span-2">
            <label className="label font-medium text-gray-700 text-base">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Product image is required" })}
              className="file-input file-input-bordered w-full px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control col-span-1 lg:col-span-2">
            <button
              type="submit"
              className="btn bg-blue-600 text-white w-full py-3 text-lg font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddProductPage;
