"use client";

import { useEffect, useState } from "react";
import { fetchDeals, fetchActiveDealCount } from "@/actions/deal.actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Handshake, DollarSign, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Deal } from "@/types";

interface DealWithMeta extends Deal {
  campaign: { id: string; title: string; budget: number | null } | null;
  brand: { id: string; full_name: string | null; avatar_url: string | null } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  active: "bg-green-500",
  completed: "bg-neutral-500",
  cancelled: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function CreatorDealsPage() {
  const [deals, setDeals] = useState<DealWithMeta[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [dealsResult, countResult] = await Promise.all([
        fetchDeals(),
        fetchActiveDealCount(),
      ]);
      
      if (dealsResult.success) {
        setDeals(dealsResult.deals as DealWithMeta[]);
      }
      if (countResult.success) {
        setActiveCount(countResult.count);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Deals</h1>
        <p className="text-muted-foreground">Manage your sponsorship deals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Handshake className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Deals</p>
              <p className="text-2xl font-bold">{deals.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Deals</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">
                {deals.filter(d => d.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Handshake className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Your sponsorship deals will appear here. Apply to campaigns to get deals from brands.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => (
            <Card key={deal.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    {deal.brand?.avatar_url ? (
                      <img src={deal.brand.avatar_url} alt={deal.brand.full_name || ""} />
                    ) : (
                      <div className="bg-muted w-full h-full" />
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{deal.campaign?.title || "Campaign"}</h3>
                    <p className="text-sm text-muted-foreground">
                      with {deal.brand?.full_name || "Brand"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {deal.agreed_amount ? `${deal.agreed_amount.toLocaleString()} NPR` : "TBD"}
                  </p>
                  <Badge className={`${statusColors[deal.status]} mt-1`}>
                    {statusLabels[deal.status]}
                  </Badge>
                </div>
              </div>
              
              {deal.escrow_status && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Escrow:</span>
                    <span className="font-medium capitalize">{deal.escrow_status}</span>
                  </div>
                  {deal.payout_status && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Payout:</span>
                      <span className="font-medium capitalize">{deal.payout_status}</span>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-4">
                Created {deal.created_at && formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}