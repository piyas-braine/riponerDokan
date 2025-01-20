"use client";
import { useForm, SubmitHandler } from "react-hook-form";

enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

interface UserFormInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  rememberMe: boolean;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInput>();

  const onSubmit: SubmitHandler<UserFormInput> = (data: UserFormInput) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white w-full md:max-w-2xl p-4 sm:p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">
          Create Moderator
        </h1>
        <p className="text-gray-600 text-center mb-4">Register to continue</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Input */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email and Password Row */}
          <div className="mb-3 sm:flex sm:space-x-4">
            {/* Email Input */}
            <div className="sm:w-1/2 mb-3 sm:mb-0">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: /^\S+@\S+$/i,
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
            <div className="sm:w-1/2">
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
          </div>

          {/* Role Dropdown */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              {...register("role", { required: "Role is required" })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.role
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            >
              <option value="">Select a role</option>
              <option value={Role.ADMIN}>Admin</option>
              <option value={Role.SUPER_ADMIN}>Super Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-3 flex items-center">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="mr-2 w-4 h-4 border-gray-300 rounded focus:ring-blue-400"
            />
            <label className="text-gray-700">Remember me</label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
