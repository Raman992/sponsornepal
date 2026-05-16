"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const niches = [
  { value: "tech", label: "Tech & Gadgets" },
  { value: "fashion", label: "Fashion & Lifestyle" },
  { value: "food", label: "Food & Dining" },
  { value: "travel", label: "Travel & Tourism" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "gaming", label: "Gaming" },
  { value: "finance", label: "Finance & Business" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
];

export function CreatorFilters() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedNiche) params.set("niche", selectedNiche);
    router.push(`/creators?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedNiche("");
    router.push("/creators");
  };

  const activeFiltersCount = [search, selectedNiche].filter(Boolean).length;

  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Niche Select */}
          <select
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="h-11 px-4 rounded-xl border bg-background text-sm"
          >
            <option value="">All Niches</option>
            {niches.map((niche) => (
              <option key={niche.value} value={niche.value}>
                {niche.label}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button type="submit">Search</Button>
            {activeFiltersCount > 0 && (
              <Button type="button" variant="ghost" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {search && (
              <Badge variant="secondary" className="gap-1">
                Search: {search}
                <button onClick={() => setSearch("")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedNiche && (
              <Badge variant="secondary" className="gap-1">
                Niche: {niches.find((n) => n.value === selectedNiche)?.label}
                <button onClick={() => setSelectedNiche("")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}