"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUpdateCreatorProfile } from "@/hooks/use-creators";
import { creatorProfileSchema, type CreatorProfileFormData } from "@/lib/validations/creator";
import type { CreatorProfile } from "@/types";

const NICHE_OPTIONS = [
  "Technology",
  "Fashion",
  "Food & Cooking",
  "Travel",
  "Fitness & Health",
  "Beauty",
  "Gaming",
  "Education",
  "Entertainment",
  "Business",
  "Lifestyle",
  "Photography",
  "Music",
  "Art & Design",
  "Sports",
  "Other",
];

const CATEGORY_OPTIONS = [
  "Lifestyle",
  "Technology",
  "Fashion & Beauty",
  "Food & Beverage",
  "Travel & Tourism",
  "Health & Fitness",
  "Education",
  "Entertainment",
  "Gaming",
  "Business & Finance",
  "Sports",
  "Parenting",
  "Automotive",
  "Real Estate",
  "Other",
];

interface CreatorProfileFormProps {
  profile: CreatorProfile | null;
  userId: string;
}

export function CreatorProfileForm({ profile, userId }: CreatorProfileFormProps) {
  const { toast } = useToast();
  const updateProfile = useUpdateCreatorProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
      niche: profile?.niche || "",
      location: profile?.location || "",
      languages: profile?.languages || [],
      instagram_handle: profile?.instagram_handle || "",
      tiktok_handle: profile?.tiktok_handle || "",
      youtube_channel: profile?.youtube_channel || "",
      instagram_followers: profile?.instagram_followers || 0,
      tiktok_followers: profile?.tiktok_followers || 0,
      youtube_subscribers: profile?.youtube_subscribers || 0,
      engagement_rate: profile?.engagement_rate || null,
      pricing_range: profile?.pricing_range || "",
      categories: profile?.categories || [],
    },
  });

  const selectedCategories = watch("categories") || [];

  const toggleCategory = (category: string) => {
    const current = selectedCategories;
    if (current.includes(category)) {
      setValue("categories", current.filter((c) => c !== category), { shouldDirty: true });
    } else {
      setValue("categories", [...current, category], { shouldDirty: true });
    }
  };

  const onSubmit = async (data: CreatorProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      if (data.bio) formData.append("bio", data.bio);
      if (data.niche) formData.append("niche", data.niche);
      if (data.location) formData.append("location", data.location);
      formData.append("languages", JSON.stringify(data.languages || []));
      if (data.instagram_handle) formData.append("instagram_handle", data.instagram_handle);
      if (data.tiktok_handle) formData.append("tiktok_handle", data.tiktok_handle);
      if (data.youtube_channel) formData.append("youtube_channel", data.youtube_channel);
      if (data.pricing_range) formData.append("pricing_range", data.pricing_range);
      formData.append("categories", JSON.stringify(data.categories || []));

      await updateProfile.mutateAsync({ userId, formData });

      toast({
        title: "Profile updated",
        description: "Your creator profile has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="your_username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell brands about yourself..."
              rows={4}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <select
                id="niche"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("niche")}
              >
                <option value="">Select your niche</option>
                {NICHE_OPTIONS.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Kathmandu, Nepal"
                {...register("location")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricing_range">Pricing Range</Label>
            <Input
              id="pricing_range"
              placeholder="e.g., NPR 5,000 - 25,000 per post"
              {...register("pricing_range")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram_handle" className="flex items-center gap-2">
              <span className="h-4 w-4 text-pink-500 font-bold text-xs">IG</span>
              Instagram Handle
            </Label>
            <Input
              id="instagram_handle"
              placeholder="@yourhandle"
              {...register("instagram_handle")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiktok_handle" className="flex items-center gap-2">
              <span className="h-4 w-4 text-foreground font-bold text-xs">TT</span>
              TikTok Handle
            </Label>
            <Input
              id="tiktok_handle"
              placeholder="@yourhandle"
              {...register("tiktok_handle")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_channel" className="flex items-center gap-2">
              <span className="h-4 w-4 text-red-500 font-bold text-xs">YT</span>
              YouTube Channel
            </Label>
            <Input
              id="youtube_channel"
              placeholder="https://youtube.com/@yourchannel"
              {...register("youtube_channel")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Content Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
          {updateProfile.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
