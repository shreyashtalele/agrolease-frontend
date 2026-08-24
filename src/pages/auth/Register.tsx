import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";

export const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "farmer" as "farmer" | "provider",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleSelect = (role: "farmer" | "provider") => {
    setFormData((prev) => ({ ...prev, role }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
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
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const RoleOption = ({
    value,
    label,
    description,
    icon,
  }: {
    value: "farmer" | "provider";
    label: string;
    description: string;
    icon: string;
  }) => (
    <label
      className={`
        flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all text-center
        ${
          formData.role === value
            ? "border-primary-500 bg-primary-50 shadow-sm"
            : "border-neutral-200 hover:border-primary-200 hover:bg-neutral-50"
        }
      `}
    >
      <input
        type="radio"
        name="role"
        value={value}
        checked={formData.role === value}
        onChange={() => handleRoleSelect(value)}
        className="sr-only"
      />
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-medium text-neutral-800 text-sm">{label}</div>
      <div className="text-xs text-neutral-500">{description}</div>
    </label>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card variant="elevated" className="max-w-md w-full p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="text-3xl md:text-4xl font-bold text-primary-500">
            🌾 AgroLease
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mt-2">
            Create Account
          </h2>
          <p className="text-sm md:text-base text-neutral-500">
            Join India's farming equipment marketplace
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-success-50 border border-success-200 rounded-lg text-center">
            <p className="text-success-700 font-medium">
              Account created successfully! 🎉
            </p>
            <p className="text-sm text-success-600 mt-1">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-600">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <Input
                label="First Name"
                name="firstName"
                placeholder="Raj"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Kumar"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>

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

            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              placeholder="9876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helper="Must be at least 8 characters with a number"
              required
              autoComplete="new-password"
            />

            <div>
              <label className="block text-sm font-medium uppercase tracking-wider text-neutral-500 mb-2">
                I am a <span className="text-error-500">*</span>
              </label>
              <div className="flex gap-3">
                <RoleOption
                  value="farmer"
                  label="Farmer"
                  description="Rent equipment"
                  icon="🧑‍🌾"
                />
                <RoleOption
                  value="provider"
                  label="Provider"
                  description="List equipment"
                  icon="🏗️"
                />
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
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-neutral-500 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
};
export default Register;
