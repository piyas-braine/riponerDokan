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
};

const AddProductPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddProductForm>();
  const router = useRouter();

  const onSubmit: SubmitHandler<TAddProductForm> = async (data) => {
    try {
      const response = await fetch("/api/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        router.push("/products"); // Redirect to products page
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
    <main className="flex items-center justify-center px-4">
      <div className="card shadow-xl p-6 max-w-lg bg-base-100 w-full my-8">
        <h1 className="text-2xl font-bold text-center">Add Product</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 mt-4"
        >
          {/* Product Name */}
          <div className="form-control">
            <label className="label font-medium">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              {...register("name", { required: "Product name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Product Price */}
          <div className="form-control">
            <label className="label font-medium">Price</label>
            <input
              type="number"
              placeholder="Enter price"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              className="input input-bordered w-full"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Product Stock */}
          <div className="form-control">
            <label className="label font-medium">Stock</label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              {...register("stock", {
                required: "Stock is required",
                valueAsNumber: true,
              })}
              className="input input-bordered w-full"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm">{errors.stock.message}</p>
            )}
          </div>

          {/* User ID */}
          <div className="form-control">
            <label className="label font-medium">User ID</label>
            <input
              type="text"
              placeholder="Enter your User ID"
              {...register("userId", { required: "User ID is required" })}
              className="input input-bordered w-full"
            />
            {errors.userId && (
              <p className="text-red-500 text-sm">{errors.userId.message}</p>
            )}
          </div>

          {/* Product Description */}
          <div className="form-control">
            <label className="label font-medium">Description</label>
            <textarea
              placeholder="Enter product description"
              {...register("description", {
                required: "Description is required",
              })}
              className="textarea textarea-bordered w-full"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control">
            <button className="btn btn-primary w-full">Add Product</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddProductPage;
