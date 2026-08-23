import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { equipmentApi } from "@/api/equipment";
import { EquipmentCard } from "@/components/shared/EquipmentCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/common/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/hooks/useToast";

export const EquipmentList = () => {
  const [searchParams] = useSearchParams();
  const { error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const loadCategories = async () => {
    try {
      const response = await equipmentApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadEquipment = async (filters?: Record<string, any>) => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 12,
        ...filters,
      };
      const response = await equipmentApi.list(params);
      setEquipment(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      toastError("Failed to load equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadEquipment();
  }, []);

  const handleSearch = (filters: Record<string, any>) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadEquipment(filters);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    const filters = Object.fromEntries(searchParams);
    loadEquipment({ ...filters, page: newPage });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Browse Equipment
          </h1>
          <p className="text-sm text-neutral-500">
            Find the right equipment for your farm
          </p>
        </div>
      </div>

      <FilterBar
        onSearch={handleSearch}
        categories={categories}
        isLoading={loading}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : equipment.length === 0 ? (
        <EmptyState
          title="No equipment found"
          description="Try adjusting your filters or search terms"
          icon="🔍"
          action={
            <Button variant="primary" onClick={() => handleSearch({})}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {equipment.map((item) => (
              <EquipmentCard key={item._id} equipment={item} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-neutral-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
