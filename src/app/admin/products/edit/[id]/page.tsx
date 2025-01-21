"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import apiClient from "@/utils/apiClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type TUpdateProductForm = {
  name: string;
  price: number;
  stock: number;
  description: string;
  image?: FileList; // Optional for updating (image may or may not be uploaded)
};

const Page = () => {
  // Assume this hook provides the logged-in user's ID
  const router = useRouter();
  const { id } = useParams(); // Get the product id from URL parameters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null); // State to store fetched product data
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TUpdateProductForm>();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        // Set form values using the fetched data
        setValue("name", fetchedProduct.name);
        setValue("price", fetchedProduct.price);
        setValue("stock", fetchedProduct.stock);
        setValue("description", fetchedProduct.description);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("An error occurred while fetching the product.");
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id, setValue]);

  const onSubmit: SubmitHandler<TUpdateProductForm> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("description", data.description);

    if (data.image?.[0]) {
      formData.append("files", data.image[0]); // Add the new image if provided
    }

    try {
      const response = await apiClient.patch(`/products/${id}`, formData);

      if (response.data) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An error occurred while updating the product.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex items-center justify-center h-full bg-gray-100">
      <div className="card shadow-lg p-4 max-w-4xl bg-white w-full rounded-lg m-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Product
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
              Product Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
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
              Update Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Page;
