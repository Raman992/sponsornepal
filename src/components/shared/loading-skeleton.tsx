"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "list" | "profile";
  className?: string;
}

export function LoadingSkeleton({ count = 3, variant = "card", className }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          {variant === "card" && <CardSkeleton />}
          {variant === "list" && <ListSkeleton />}
          {variant === "profile" && <ProfileSkeleton />}
        </motion.div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
      <div className="w-12 h-12 rounded-xl bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </div>
      <div className="h-8 w-16 bg-muted rounded-lg" />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
        <div className="h-4 w-3/5 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-2">
            <div className="h-8 w-12 mx-auto bg-muted rounded" />
            <div className="h-3 w-16 mx-auto bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}