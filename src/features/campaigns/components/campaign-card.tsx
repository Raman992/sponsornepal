"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Campaign, User } from "@/types";

interface CampaignCardProps {
  campaign: Campaign & { brand?: User };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-600",
    open: "bg-emerald-500/10 text-emerald-600",
    in_progress: "bg-neutral-500/10 text-foreground",
    completed: "bg-neutral-500/10 text-foreground",
    cancelled: "bg-red-500/10 text-red-600",
  };

  const initials = campaign.brand?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/campaigns/${campaign.id}`}>
        <Card className="h-full overflow-hidden hover-lift group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={campaign.brand?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-neutral-600 text-white text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{campaign.brand?.full_name || "Brand"}</p>
                  <p className="text-xs text-muted-foreground">Brand</p>
                </div>
              </div>
              <Badge className={statusColors[campaign.status]}>
                {campaign.status.replace("_", " ")}
              </Badge>
            </div>

            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {campaign.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {campaign.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {campaign.platform_requirements?.slice(0, 3).map((platform) => (
                <Badge key={platform} variant="secondary" className="text-xs">
                  {platform}
                </Badge>
              ))}
              {campaign.platform_requirements && campaign.platform_requirements.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{campaign.platform_requirements.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {campaign.budget && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <DollarSign className="h-4 w-4" />
                    NPR {campaign.budget.toLocaleString()}
                  </span>
                )}
                {campaign.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function CampaignCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}