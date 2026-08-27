import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { equipmentApi } from "@/api/equipment";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatters";
import type { Equipment } from "@/types";

interface Listing extends Equipment {
  views?: number;
  bookings?: number;
}

export const MyListings = () => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "available" | "booked" | "pending"
  >("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<Equipment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "tractor",
    rentalPricePerDay: "",
    securityDeposit: "",
    quantity: "1",
    city: "",
    state: "",
    pincode: "",
    brand: "",
    model: "",
    modelYear: "",
    powerSource: "diesel",
    horsepower: "",
    hours: "",
    description: "",
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "available", label: "Available" },
    { id: "booked", label: "Booked" },
    { id: "pending", label: "Pending" },
  ];

  const categories = [
    "tractor",
    "harvester",
    "plow",
    "cultivator",
    "seeder",
    "sprayer",
    "irrigation",
    "baler",
    "combine",
    "mower",
    "other",
  ];

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await equipmentApi.getMyListings();
      // Get the array from the paginated response
      const listingsData = response.data?.data || [];
      const listingsWithUI = listingsData.map((item: Equipment) => ({
        ...item,
        views: item.viewsCount || 0,
        bookings: 0,
      }));
      setListings(listingsWithUI);
    } catch (err) {
      toastError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadListings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="success" withDot>
            Available
          </Badge>
        );
      case "booked":
        return (
          <Badge variant="error" withDot>
            Booked
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" withDot>
            Pending Review
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-l-4 border-success-500";
      case "booked":
        return "border-l-4 border-error-500";
      case "pending":
        return "border-l-4 border-warning-500";
      default:
        return "";
    }
  };

  const getFilteredListings = () => {
    if (activeTab === "all") return listings;
    return listings.filter((l) => l.status === activeTab);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        rentalPricePerDay: Number(formData.rentalPricePerDay),
        securityDeposit: Number(formData.securityDeposit) || 0,
        quantity: Number(formData.quantity) || 1,
        location: {
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        specifications: {
          brand: formData.brand,
          model: formData.model,
          modelYear: Number(formData.modelYear) || undefined,
          powerSource: formData.powerSource,
          horsepower: Number(formData.horsepower) || undefined,
          hours: Number(formData.hours) || undefined,
        },
      };

      if (editingListing) {
        await equipmentApi.update(editingListing._id, data);
        success("Listing updated successfully!");
      } else {
        await equipmentApi.create(data);
        success("Listing created successfully! Waiting for verification.");
      }

      setShowAddModal(false);
      setEditingListing(null);
      setFormData({
        title: "",
        category: "tractor",
        rentalPricePerDay: "",
        securityDeposit: "",
        quantity: "1",
        city: "",
        state: "",
        pincode: "",
        brand: "",
        model: "",
        modelYear: "",
        powerSource: "diesel",
        horsepower: "",
        hours: "",
        description: "",
      });
      loadListings();
    } catch (err) {
      toastError(
        editingListing
          ? "Failed to update listing"
          : "Failed to create listing",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    try {
      await equipmentApi.delete(showDeleteModal);
      success("Listing deleted successfully");
      setShowDeleteModal(null);
      loadListings();
    } catch (err) {
      toastError("Failed to delete listing");
    }
  };

  const handleEdit = (listing: Equipment) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      category: listing.category,
      rentalPricePerDay: listing.rentalPricePerDay.toString(),
      securityDeposit: "0",
      quantity: "1",
      city: listing.location.city,
      state: listing.location.state,
      pincode: listing.location.pincode || "",
      brand: listing.specifications?.brand || "",
      model: listing.specifications?.model || "",
      modelYear: listing.specifications?.modelYear?.toString() || "",
      powerSource: listing.specifications?.powerSource || "diesel",
      horsepower: listing.specifications?.horsepower?.toString() || "",
      hours: listing.specifications?.hours?.toString() || "",
      description: listing.description || "",
    });
    setShowAddModal(true);
  };

  const filteredListings = getFilteredListings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            My Listings
          </h1>
          <p className="text-sm text-neutral-500">
            Manage your equipment listings ({listings.length} total)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingListing(null);
            setFormData({
              title: "",
              category: "tractor",
              rentalPricePerDay: "",
              securityDeposit: "",
              quantity: "1",
              city: "",
              state: "",
              pincode: "",
              brand: "",
              model: "",
              modelYear: "",
              powerSource: "diesel",
              horsepower: "",
              hours: "",
              description: "",
            });
            setShowAddModal(true);
          }}
        >
          + Add New Listing
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Total
          </p>
          <p className="text-2xl font-bold text-primary-500 mt-1">
            {listings.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Available
          </p>
          <p className="text-2xl font-bold text-success-500 mt-1">
            {listings.filter((l) => l.status === "available").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Booked
          </p>
          <p className="text-2xl font-bold text-error-500 mt-1">
            {listings.filter((l) => l.status === "booked").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Pending
          </p>
          <p className="text-2xl font-bold text-warning-500 mt-1">
            {listings.filter((l) => l.status === "pending").length}
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-1 bg-white rounded-lg border border-neutral-200 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all
              ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
            <span
              className={`
                ml-2 px-2 py-0.5 text-xs rounded-full
                ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }
              `}
            >
              {tab.id === "all"
                ? listings.length
                : listings.filter((l) => l.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            No listings found
          </h3>
          <p className="text-neutral-500">
            You don't have any {activeTab !== "all" ? activeTab : ""} listings.
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => {
              setEditingListing(null);
              setFormData({
                title: "",
                category: "tractor",
                rentalPricePerDay: "",
                securityDeposit: "",
                quantity: "1",
                city: "",
                state: "",
                pincode: "",
                brand: "",
                model: "",
                modelYear: "",
                powerSource: "diesel",
                horsepower: "",
                hours: "",
                description: "",
              });
              setShowAddModal(true);
            }}
          >
            Add Your First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredListings.map((listing) => (
            <Card
              key={listing._id}
              className={`p-4 hover:shadow-md transition-shadow ${getStatusColor(listing.status)}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  🚜
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-neutral-800 truncate">
                      {listing.title}
                    </h3>
                    {getStatusBadge(listing.status)}
                  </div>
                  <p className="text-sm text-neutral-500">
                    📍 {listing.location.city}, {listing.location.state}
                  </p>
                  <p className="text-sm font-medium text-primary-600 mt-1">
                    {formatCurrency(listing.rentalPricePerDay)} / day
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-500">
                    <span>👁️ {listing.views || 0} views</span>
                    <span>•</span>
                    <span>📅 {listing.bookings || 0} bookings</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(listing)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(listing._id)}
                >
                  Delete
                </Button>
                <Link to={`/equipment/${listing._id}`} className="ml-auto">
                  <Button variant="ghost" size="sm">
                    View Details →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingListing(null);
        }}
        title={editingListing ? "Edit Listing" : "Add New Listing"}
        maxWidth="2xl"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowAddModal(false);
                setEditingListing(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              {editingListing ? "Update Listing" : "Add Listing"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Equipment Title"
            name="title"
            placeholder="e.g. John Deere 5050D Tractor"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-md bg-white text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Price per day (₹)"
              name="rentalPricePerDay"
              type="number"
              placeholder="2500"
              value={formData.rentalPricePerDay}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              placeholder="e.g. Pune"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Input
              label="State"
              name="state"
              placeholder="e.g. Maharashtra"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <Input
              label="Pincode"
              name="pincode"
              type="text"
              placeholder="411001"
              value={formData.pincode}
              onChange={handleChange}
              required
              helper="Must be 5-6 digits"
              maxLength={6}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Brand"
              name="brand"
              placeholder="e.g. John Deere"
              value={formData.brand}
              onChange={handleChange}
            />
            <Input
              label="Model"
              name="model"
              placeholder="e.g. 5050D"
              value={formData.model}
              onChange={handleChange}
            />
            <Input
              label="Year"
              name="modelYear"
              type="number"
              placeholder="2024"
              value={formData.modelYear}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-md bg-white text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-y"
              placeholder="Describe your equipment in detail..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="Delete Listing"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowDeleteModal(null)}
            >
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete}>
              Yes, Delete
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-error-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            ⚠️
          </div>
          <div>
            <p className="font-medium text-neutral-800">Delete this listing?</p>
            <p className="text-sm text-neutral-500">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default MyListings;
