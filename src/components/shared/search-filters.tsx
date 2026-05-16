"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    niche?: string;
    platform?: string;
    minFollowers?: number;
    maxBudget?: number;
  };
  onFiltersChange: (filters: any) => void;
}

const niches = [
  { value: "tech", label: "Tech & Gadgets" },
  { value: "fashion", label: "Fashion & Lifestyle" },
  { value: "food", label: "Food & Dining" },
  { value: "travel", label: "Travel & Tourism" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "gaming", label: "Gaming" },
  { value: "finance", label: "Finance & Business" },
];

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
];

export function SearchFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creators by name or username..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && "bg-primary/10")}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2 h-5 w-5 p-0 justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-xl border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Niche */}
            <div>
              <label className="text-sm font-medium mb-2 block">Niche</label>
              <select
                value={filters.niche || ""}
                onChange={(e) => handleFilterChange("niche", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
              >
                <option value="">All niches</option>
                {niches.map((niche) => (
                  <option key={niche.value} value={niche.value}>
                    {niche.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="text-sm font-medium mb-2 block">Platform</label>
              <select
                value={filters.platform || ""}
                onChange={(e) => handleFilterChange("platform", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
              >
                <option value="">All platforms</option>
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Followers */}
            <div>
              <label className="text-sm font-medium mb-2 block">Min Followers</label>
              <Input
                type="number"
                placeholder="e.g. 10000"
                value={filters.minFollowers || ""}
                onChange={(e) => handleFilterChange("minFollowers", parseInt(e.target.value) || undefined)}
              />
            </div>

            {/* Max Budget */}
            <div>
              <label className="text-sm font-medium mb-2 block">Max Budget (NPR)</label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={filters.maxBudget || ""}
                onChange={(e) => handleFilterChange("maxBudget", parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.niche && (
            <Badge variant="secondary" className="gap-1">
              {niches.find((n) => n.value === filters.niche)?.label}
              <button onClick={() => handleFilterChange("niche", "")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.platform && (
            <Badge variant="secondary" className="gap-1">
              {platforms.find((p) => p.value === filters.platform)?.label}
              <button onClick={() => handleFilterChange("platform", "")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.minFollowers && (
            <Badge variant="secondary" className="gap-1">
              Min {filters.minFollowers.toLocaleString()} followers
              <button onClick={() => handleFilterChange("minFollowers", undefined)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.maxBudget && (
            <Badge variant="secondary" className="gap-1">
              Max NPR {filters.maxBudget.toLocaleString()}
              <button onClick={() => handleFilterChange("maxBudget", undefined)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}