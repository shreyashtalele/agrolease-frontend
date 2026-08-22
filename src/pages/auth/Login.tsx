import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock user data
      const mockUser = {
        id: "user_123",
        email: formData.email,
        firstName: "Raj",
        lastName: "Kumar",
        role: "farmer" as const,
        phoneNumber: "9876543210",
        isVerified: true,
        isActive: true,
      };

      login(mockUser, "mock-token", "mock-refresh-token");
      navigate("/dashboard");
    } catch {
      setErrors({ general: "Invalid email or password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card variant="elevated" className="max-w-md w-full p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-3xl md:text-4xl font-bold text-primary-500">
            🌾 AgroLease
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mt-2">
            Welcome Back
          </h2>
          <p className="text-sm md:text-base text-neutral-500">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {errors.general && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-600">
              {errors.general}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="farmer@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-neutral-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Create one
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
