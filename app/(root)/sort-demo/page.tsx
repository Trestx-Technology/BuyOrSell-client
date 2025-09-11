"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SortDropdown from "../post-ad/_components/SortDropdown";
import SortAndViewControls, {
  ViewMode,
} from "../post-ad/_components/SortAndViewControls";

// Mock data for demonstration
const mockListings = [
  {
    id: "1",
    title: "BMW 5 Series 2023",
    price: 105452,
    postedTime: "2hr ago",
  },
  {
    id: "2",
    title: "Toyota Camry 2022",
    price: 85000,
    postedTime: "1 day ago",
  },
  {
    id: "3",
    title: "Mercedes C-Class 2021",
    price: 120000,
    postedTime: "3 days ago",
  },
  {
    id: "4",
    title: "Honda Civic 2020",
    price: 75000,
    postedTime: "1 week ago",
  },
];

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "name-asc", label: "Name (A to Z)" },
  { value: "name-desc", label: "Name (Z to A)" },
];

export default function SortDemo() {
  const [sortValue, setSortValue] = useState("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilter, setShowFilter] = useState(false);

  const handleSortChange = (value: string) => {
    setSortValue(value);
    console.log("Sort changed to:", value);
  };

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    console.log("View changed to:", mode);
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
    console.log("Filter clicked, showFilter:", !showFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sort Components Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reusable sort and view control components with callback support.
          </p>
        </div>

        {/* Basic Sort Dropdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Basic Sort Dropdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Small Size */}
              <div>
                <h3 className="font-semibold mb-2">Small Size</h3>
                <SortDropdown
                  options={sortOptions}
                  value={sortValue}
                  onValueChange={handleSortChange}
                  placeholder="Sort by"
                  label="Sort:"
                  size="sm"
                />
              </div>

              {/* Medium Size */}
              <div>
                <h3 className="font-semibold mb-2">Medium Size</h3>
                <SortDropdown
                  options={sortOptions}
                  value={sortValue}
                  onValueChange={handleSortChange}
                  placeholder="Sort by"
                  label="Sort:"
                  size="md"
                />
              </div>

              {/* Large Size */}
              <div>
                <h3 className="font-semibold mb-2">Large Size</h3>
                <SortDropdown
                  options={sortOptions}
                  value={sortValue}
                  onValueChange={handleSortChange}
                  placeholder="Sort by"
                  label="Sort:"
                  size="lg"
                />
              </div>
            </div>

            {/* Without Label */}
            <div>
              <h3 className="font-semibold mb-2">Without Label</h3>
              <SortDropdown
                options={sortOptions}
                value={sortValue}
                onValueChange={handleSortChange}
                placeholder="Choose sorting option"
                size="md"
              />
            </div>

            {/* Disabled State */}
            <div>
              <h3 className="font-semibold mb-2">Disabled State</h3>
              <SortDropdown
                options={sortOptions}
                value={sortValue}
                onValueChange={handleSortChange}
                placeholder="Sort by"
                label="Sort:"
                disabled={true}
                size="md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sort and View Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Sort and View Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Basic Controls */}
              <div>
                <h3 className="font-semibold mb-2">Basic Controls</h3>
                <SortAndViewControls
                  sortOptions={sortOptions}
                  sortValue={sortValue}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewChange={handleViewChange}
                  showViewToggle={true}
                  showFilterButton={false}
                  size="md"
                />
              </div>

              {/* With Filter Button */}
              <div>
                <h3 className="font-semibold mb-2">With Filter Button</h3>
                <SortAndViewControls
                  sortOptions={sortOptions}
                  sortValue={sortValue}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewChange={handleViewChange}
                  showViewToggle={true}
                  showFilterButton={true}
                  onFilterClick={handleFilterClick}
                  filterButtonText="Filters"
                  size="md"
                />
              </div>

              {/* Small Size */}
              <div>
                <h3 className="font-semibold mb-2">Small Size</h3>
                <SortAndViewControls
                  sortOptions={sortOptions}
                  sortValue={sortValue}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewChange={handleViewChange}
                  showViewToggle={true}
                  showFilterButton={true}
                  onFilterClick={handleFilterClick}
                  size="sm"
                />
              </div>

              {/* Large Size */}
              <div>
                <h3 className="font-semibold mb-2">Large Size</h3>
                <SortAndViewControls
                  sortOptions={sortOptions}
                  sortValue={sortValue}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewChange={handleViewChange}
                  showViewToggle={true}
                  showFilterButton={true}
                  onFilterClick={handleFilterClick}
                  size="lg"
                />
              </div>

              {/* Without View Toggle */}
              <div>
                <h3 className="font-semibold mb-2">Without View Toggle</h3>
                <SortAndViewControls
                  sortOptions={sortOptions}
                  sortValue={sortValue}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewChange={handleViewChange}
                  showViewToggle={false}
                  showFilterButton={true}
                  onFilterClick={handleFilterClick}
                  size="md"
                />
              </div>

              {/* Disabled State */}
              <div>
                <h3 className="font-semibold mb-2">Disabled State</h3>
                <SortAndViewControls
                  sortOptions={sortOptions}
                  sortValue={sortValue}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewChange={handleViewChange}
                  showViewToggle={true}
                  showFilterButton={true}
                  onFilterClick={handleFilterClick}
                  disabled={true}
                  size="md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current State Display */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Current State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Sort Value</h4>
                <p className="text-gray-600">{sortValue}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">View Mode</h4>
                <p className="text-gray-600">{viewMode}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Filter State</h4>
                <p className="text-gray-600">
                  {showFilter ? "Open" : "Closed"}
                </p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Total Listings</h4>
                <p className="text-gray-600">{mockListings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Basic Sort Dropdown
                </h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`<SortDropdown
  options={sortOptions}
  value={sortValue}
  onValueChange={handleSortChange}
  placeholder="Sort by"
  label="Sort:"
  size="md"
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Sort and View Controls
                </h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`<SortAndViewControls
  sortOptions={sortOptions}
  sortValue={sortValue}
  onSortChange={handleSortChange}
  viewMode={viewMode}
  onViewChange={handleViewChange}
  showViewToggle={true}
  showFilterButton={true}
  onFilterClick={handleFilterClick}
  size="md"
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  TypeScript Interface
                </h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Callback Support</h3>
                <p className="text-gray-600 text-sm">
                  Full callback support for sort and view changes
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Responsive</h3>
                <p className="text-gray-600 text-sm">
                  Multiple sizes and responsive design
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Configurable</h3>
                <p className="text-gray-600 text-sm">
                  Highly configurable with optional features
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Customizable</h3>
                <p className="text-gray-600 text-sm">
                  Custom styling and behavior options
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">♿</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Accessible</h3>
                <p className="text-gray-600 text-sm">
                  Built with accessibility in mind
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">TypeScript</h3>
                <p className="text-gray-600 text-sm">
                  Full TypeScript support with type safety
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

