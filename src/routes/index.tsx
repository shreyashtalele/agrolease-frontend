import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./PrivateRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { EquipmentList } from "@/pages/equipment/EquipmentList";
import { EquipmentDetails } from "@/pages/equipment/EquipmentDetails";
import { Bookings } from "@/pages/bookings/Bookings";
import { MyListings } from "@/pages/listings/MyListings";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/bookings" element={<Bookings />} />

          {/* Provider Routes */}
          <Route element={<RoleBasedRoute allowedRoles={["provider"]} />}>
            <Route path="/listings" element={<MyListings />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
