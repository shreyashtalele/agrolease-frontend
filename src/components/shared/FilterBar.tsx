import React, { useState } from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

interface FilterState {
  search: string;
  category: string;
  city: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterBarProps {
  onSearch: (filters: Partial<FilterState>) => void;
  categories: string[];
  isLoading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  categories,
  isLoading = false,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedFilters: Partial<FilterState> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") {
        cleanedFilters[key as keyof FilterState] = value;
      }
    });
    onSearch(cleanedFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      search: "",
      category: "",
      city: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(resetFilters);
    onSearch({});
  };

  return (
    <Card className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              name="search"
              placeholder="Search equipment..."
              value={filters.search}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" loading={isLoading}>
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "−" : "+"}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-neutral-200">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                City
              </label>
              <Input
                name="city"
                placeholder="Enter city"
                value={filters.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Min Price
              </label>
              <Input
                name="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Max Price
              </label>
              <Input
                name="maxPrice"
                type="number"
                placeholder="10000"
                value={filters.maxPrice}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Reset button */}
        {showAdvanced && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};
