import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";

export const Dashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Welcome back, {user?.firstName || "User"} 👋
          </h1>
          <p className="text-sm text-neutral-500">
            Here's what's happening with your account
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Role
          </p>
          <p className="text-xl font-bold text-primary-500 mt-1 capitalize">
            {user?.role}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Email
          </p>
          <p className="text-xl font-bold text-neutral-800 mt-1 truncate">
            {user?.email}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Status
          </p>
          <div className="mt-1">
            <Badge variant="success" withDot>
              Active
            </Badge>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-neutral-800 mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button>Browse Equipment</Button>
          <Button variant="outline">My Bookings</Button>
          {user?.role === "provider" && (
            <Button variant="outline">My Listings</Button>
          )}
          {user?.role === "admin" && (
            <Button variant="danger">Admin Dashboard</Button>
          )}
        </div>
      </Card>
    </div>
  );
};
