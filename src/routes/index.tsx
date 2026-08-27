import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./PrivateRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Lazy load pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const EquipmentList = lazy(() => import("@/pages/equipment/EquipmentList"));
const EquipmentDetails = lazy(
  () => import("@/pages/equipment/EquipmentDetails"),
);
const Bookings = lazy(() => import("@/pages/bookings/Bookings"));
const BookingDetails = lazy(() => import("@/pages/bookings/BookingDetails")); // ✅ NEW
const MyListings = lazy(() => import("@/pages/listings/MyListings"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Notifications = lazy(() => import("@/pages/notifications/Notifications"));
const PaymentHistory = lazy(() => import("@/pages/payments/PaymentHistory"));

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LazyWrapper>
            <Login />
          </LazyWrapper>
        }
      />
      <Route
        path="/register"
        element={
          <LazyWrapper>
            <Register />
          </LazyWrapper>
        }
      />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <LazyWrapper>
                <Dashboard />
              </LazyWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <LazyWrapper>
                <Dashboard />
              </LazyWrapper>
            }
          />
          <Route
            path="/equipment"
            element={
              <LazyWrapper>
                <EquipmentList />
              </LazyWrapper>
            }
          />
          <Route
            path="/equipment/:id"
            element={
              <LazyWrapper>
                <EquipmentDetails />
              </LazyWrapper>
            }
          />
          <Route
            path="/bookings"
            element={
              <LazyWrapper>
                <Bookings />
              </LazyWrapper>
            }
          />
          {/* ✅ NEW: Booking Details Route */}
          <Route
            path="/bookings/:id"
            element={
              <LazyWrapper>
                <BookingDetails />
              </LazyWrapper>
            }
          />
          <Route
            path="/notifications"
            element={
              <LazyWrapper>
                <Notifications />
              </LazyWrapper>
            }
          />
          <Route
            path="/payments"
            element={
              <LazyWrapper>
                <PaymentHistory />
              </LazyWrapper>
            }
          />

          {/* Provider Routes */}
          <Route element={<RoleBasedRoute allowedRoles={["provider"]} />}>
            <Route
              path="/listings"
              element={
                <LazyWrapper>
                  <MyListings />
                </LazyWrapper>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin"
              element={
                <LazyWrapper>
                  <AdminDashboard />
                </LazyWrapper>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
