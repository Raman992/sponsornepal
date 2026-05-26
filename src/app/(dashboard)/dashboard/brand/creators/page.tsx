"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, Bookmark, BookmarkCheck, Loader2, Users } from "lucide-react";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { getTopCreatorsAction } from "@/actions";
import { CreatorCard, CreatorCardSkeleton } from "@/features/creators/components/creator-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CreatorProfile } from "@/types";

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

export default function BrandCreatorsPage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [savedCreators, setSavedCreators] = useState<Set<string>>(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    const loadCreators = async () => {
      setIsLoading(true);
      const result = await getTopCreatorsAction(50);
      if (result.success && result.data) {
        setCreators(result.data.creators || []);
      }
      setIsLoading(false);
    };

    loadCreators();
  }, []);

  const handleToggleSave = (creatorId: string) => {
    setSavedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) {
        next.delete(creatorId);
      } else {
        next.add(creatorId);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedNiche("");
    setShowSavedOnly(false);
  };

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      !search ||
      creator.username.toLowerCase().includes(search.toLowerCase()) ||
      (creator.bio && creator.bio.toLowerCase().includes(search.toLowerCase()));

    const matchesNiche = !selectedNiche || creator.niche === selectedNiche;

    const matchesSaved = !showSavedOnly || savedCreators.has(creator.id);

    return matchesSearch && matchesNiche && matchesSaved;
  });

  const activeFiltersCount = [search, selectedNiche, showSavedOnly ? "saved" : ""].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">Discover Creators</h1>
              <p className="text-sm text-muted-foreground">Find and connect with top Nepali creators</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showSavedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className="gap-2"
              >
                {showSavedOnly ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {showSavedOnly ? "Saved" : "Saved"}
                </span>
                {savedCreators.size > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {savedCreators.size}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search creators by name or bio..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="h-10 px-4 rounded-lg border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All Niches</option>
                  {niches.map((niche) => (
                    <option key={niche.value} value={niche.value}>
                      {niche.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

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
                  {showSavedOnly && (
                    <Badge variant="secondary" className="gap-1">
                      <BookmarkCheck className="h-3 w-3" />
                      Saved only
                      <button onClick={() => setShowSavedOnly(false)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCreators.length} creator{filteredCreators.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CreatorCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map((creator, index) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <CreatorCard creator={creator as any} />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleSave(creator.id);
                    }}
                    className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                  >
                    {savedCreators.has(creator.id) ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No creators found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {showSavedOnly
                  ? "You haven't saved any creators yet. Browse and save creators you're interested in."
                  : "Try adjusting your search or filters to find more creators."}
              </p>
              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
