"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type TAddProductForm = {
  name: string;
  price: number;
  stock: number;
  userId: string;
  description: string;
  image: FileList; // To handle file uploads
};

const AddProductPage = () => {
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
    formData.append("userId", data.userId);
    formData.append("description", data.description);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]); // Add the first selected file
    }

    try {
      const response = await fetch("/api/add-product", {
        method: "POST",
        body: formData, // Send multipart/form-data
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        router.push("/products");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="card shadow-xl p-8 max-w-2xl bg-white w-full rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add Product
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6"
        >
          {/* Product Name */}
          <div className="form-control">
            <label className="label font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              {...register("name", { required: "Product name is required" })}
              className="input input-bordered w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Product Price */}
          <div className="form-control">
            <label className="label font-medium text-gray-700">Price</label>
            <input
              type="number"
              placeholder="Enter price"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "Price must be greater than 0",
              })}
              className="input input-bordered w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Product Stock */}
          <div className="form-control">
            <label className="label font-medium text-gray-700">Stock</label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              {...register("stock", {
                required: "Stock is required",
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "Stock must be greater than 0",
              })}
              className="input input-bordered w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* User ID */}
          <div className="form-control">
            <label className="label font-medium text-gray-700">User ID</label>
            <input
              type="text"
              placeholder="Enter your User ID"
              {...register("userId", { required: "User ID is required" })}
              className="input input-bordered w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.userId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div className="form-control">
            <label className="label font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              {...register("description", {
                required: "Description is required",
              })}
              className="textarea textarea-bordered w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="form-control">
            <label className="label font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Product image is required" })}
              className="file-input file-input-bordered w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control">
            <button
              type="submit"
              className="btn bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
