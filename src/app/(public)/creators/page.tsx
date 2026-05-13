import type { Metadata } from "next";
import { Suspense } from "react";
import { CreatorFilters } from "@/features/creators/components/creator-filters";
import { CreatorCard, CreatorCardSkeleton } from "@/features/creators/components/creator-card";
import { getTopCreatorsAction, getCreatorsWithFiltersAction } from "@/actions";
import type { CreatorProfile } from "@/types";

export const metadata: Metadata = {
  title: "Discover Creators",
  description: "Browse and discover Nepali content creators for your brand campaigns",
};

interface CreatorsPageProps {
  searchParams: Promise<{ search?: string; niche?: string; minFollowers?: string; location?: string; page?: string }>;
}

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const params = await searchParams;
  const { search, niche, minFollowers, location, page } = params;

  let result;
  let totalCount = 0;

  if (search || niche || minFollowers) {
    result = await getCreatorsWithFiltersAction({
      search,
      niche,
      minFollowers: minFollowers ? parseInt(minFollowers) : undefined,
      page: page ? parseInt(page) : 1,
    });
    if (result.success && result.data) {
      totalCount = result.data.total;
    }
  } else {
    result = await getTopCreatorsAction(20);
  }

  const creators: (CreatorProfile & { user?: { full_name?: string | null; avatar_url?: string | null; is_verified?: boolean } })[] = 
    result?.success && 'creators' in (result as any) ? ((result as any).creators || []) : [];

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
            creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator as any} />
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
            Showing {creators.length} creators{totalCount > 0 ? ` of ${totalCount}` : ''}
          </p>
          {totalCount > 20 && (
            <div className="flex justify-center gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}