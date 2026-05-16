"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreatorProfile, User } from "@/types";

interface CreatorCardProps {
  creator: CreatorProfile & { user?: User };
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const totalFollowers = (creator.instagram_followers || 0) + 
                          (creator.tiktok_followers || 0) + 
                          (creator.youtube_subscribers || 0);

  const user = creator.user;

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "C";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/creators/${creator.username}`}>
        <Card className="h-full overflow-hidden hover-lift group cursor-pointer">
          {/* Banner */}
          <div className="relative h-24 bg-gradient-to-r from-primary/20 to-violet-500/20">
            {creator.banner_url && (
              <img 
                src={creator.banner_url} 
                alt="" 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Avatar */}
            <div className="absolute -bottom-8 left-4">
              <Avatar className="h-16 w-16 ring-4 ring-background">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Verified Badge */}
            {user?.is_verified && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-emerald-500/90 text-white gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="pt-10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {user?.full_name || "Creator"}
                </h3>
                <p className="text-sm text-muted-foreground">@{creator.username}</p>
              </div>
            </div>

            {creator.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {creator.bio}
              </p>
            )}

            {/* Niche & Location */}
            <div className="flex items-center gap-2 mb-4">
              {creator.niche && (
                <Badge variant="secondary" className="text-xs">
                  {creator.niche}
                </Badge>
              )}
              {creator.location && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {creator.location}
                </span>
              )}
            </div>

            {/* Social Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-xl">
              {creator.instagram_followers ? (
                <div className="text-center">
                  <div className="text-sm font-semibold">
                    {formatNumber(creator.instagram_followers)}
                  </div>
                  <div className="text-xs text-muted-foreground">IG</div>
                </div>
              ) : null}
              
              {creator.tiktok_followers ? (
                <div className="text-center">
                  <div className="text-sm font-semibold">
                    {formatNumber(creator.tiktok_followers)}
                  </div>
                  <div className="text-xs text-muted-foreground">TikTok</div>
                </div>
              ) : null}
              
              {creator.youtube_subscribers ? (
                <div className="text-center">
                  <div className="text-sm font-semibold">
                    {formatNumber(creator.youtube_subscribers)}
                  </div>
                  <div className="text-xs text-muted-foreground">YT</div>
                </div>
              ) : null}
            </div>

            {/* Engagement Rate */}
            {creator.engagement_rate && (
              <div className="mt-3 text-center">
                <span className="text-xs text-muted-foreground">Engagement Rate</span>
                <div className="text-lg font-bold text-emerald-600">
                  {creator.engagement_rate}%
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function CreatorCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative h-24 bg-muted animate-pulse" />
      <CardContent className="pt-10">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}