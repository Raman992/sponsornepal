import type { Metadata } from "next";
import { CampaignCard } from "@/features/campaigns/components/campaign-card";
import { getOpenCampaignsAction } from "@/actions";
import type { Campaign } from "@/types";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Browse available brand campaigns and sponsorship opportunities",
};

export default async function CampaignsPage() {
  const result = await getOpenCampaignsAction(20);
  const campaigns: Campaign[] = result.success && 'data' in result ? (result.data || []) : [];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Brand Campaigns
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exciting campaigns from top Nepali brands. Apply now and start building your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.length > 0 ? (
            campaigns.map((campaign: any) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-64" />
              ))}
            </>
          )}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">No Campaigns Yet</h2>
            <p className="text-muted-foreground">
              Check back soon for new opportunities from top brands.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}