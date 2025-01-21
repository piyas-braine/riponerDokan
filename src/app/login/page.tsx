"use client";
import Cookies from "js-cookie"; // Import js-cookie

import { useAuth } from "@/Providers/AuthContext";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

interface LoginFormInput {
  email: string;
  password: string;
}

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();

  const router = useRouter();

  const { setToken, setRole } = useAuth();

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const result = await response.json();
      const { token, user } = result;

      setToken(token);
      setRole(user.role);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", user.role);

      Cookies.set("authToken", token, { expires: 7 });
      Cookies.set("userRole", user.role, { expires: 7 });

      if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
        router.push("/admin");
      } else {
        alert("Unauthorized");
      }
    } catch (error) {
      toast.error((error as Error).message || "failed to login");
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white w-full md:max-w-md p-4 sm:p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Login</h1>
        <p className="text-gray-600 text-center mb-4">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
