import type { Metadata } from "next";
import { Suspense } from "react";
import { CreatorFilters } from "@/features/creators/components/creator-filters";
import { CreatorCardSkeleton } from "@/features/creators/components/creator-card";
import { getTopCreatorsAction } from "@/actions";
import type { CreatorProfile } from "@/types";

export const metadata: Metadata = {
  title: "Discover Creators",
  description: "Browse and discover Nepali content creators for your brand campaigns",
};

export default async function CreatorsPage() {
  const result = await getTopCreatorsAction(20);
  const creators: (CreatorProfile & { user?: { full_name?: string | null; avatar_url?: string | null } })[] = result.success && 'creators' in result ? (result.creators || []) : [];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Nepali Creators
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect creators for your brand campaigns. Browse verified profiles, 
            check engagement metrics, and connect directly.
          </p>
        </div>

        <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded-lg mb-6" />}>
          <CreatorFilters />
        </Suspense>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creators.length > 0 ? (
            creators.map((creator: any) => (
              <div key={creator.id} className="animate-in">
                <div className="text-lg font-semibold mb-4">
                  {/* Creator cards would go here */}
                </div>
              </div>
            ))
          ) : (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CreatorCardSkeleton key={i} />
              ))}
            </>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Showing {creators.length} creators
          </p>
          <div className="flex justify-center gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors" disabled>
              Previous
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}