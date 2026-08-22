import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-lg w-full space-y-8 bg-white rounded-xl p-6 md:p-8 shadow-sm border border-neutral-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500">🌾 AgroLease</h1>
          <p className="text-neutral-600 mt-1">Input Component Demo</p>
        </div>

        <div className="space-y-4">
          {/* Basic Input */}
          <Input
            label="Email Address"
            type="email"
            placeholder="farmer@example.com"
            helper="We'll never share your email"
          />

          {/* Input with Value */}
          <Input label="Full Name" placeholder="Raj Kumar" value="Raj Kumar" />

          {/* Required Input */}
          <Input
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            required
            helper="Enter 10-digit phone number"
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            helper="Must be at least 8 characters"
          />

          {/* Error State */}
          <Input
            label="Username"
            placeholder="Enter username"
            value="invalid@"
            error="Username must be at least 3 characters"
          />

          {/* Disabled Input */}
          <Input label="Disabled Field" value="Cannot edit this" disabled />

          <Button fullWidth>Submit</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
