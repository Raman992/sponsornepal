"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { campaignSchema } from "@/lib/validations/campaign";
import { createCampaignAction } from "@/actions/campaign.actions";
import { toast } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
];

const campaignTypes = [
  { value: "product_review", label: "Product Review" },
  { value: "brand_ambassador", label: "Brand Ambassador" },
  { value: "giveaway", label: "Giveaway/Contest" },
  { value: "content_creation", label: "Content Creation" },
  { value: "live_stream", label: "Live Stream" },
  { value: "story_promo", label: "Story Promotion" },
  { value: "video_ad", label: "Video Ad" },
  { value: "other", label: "Other" },
];

interface CampaignFormProps {
  onSuccess?: () => void;
}

export function CampaignForm({ onSuccess }: CampaignFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      deliverables: "",
      target_audience: "",
      deadline: "",
      campaign_type: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!user) return;
    
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] || "");
      });
      formData.append("platform_requirements", JSON.stringify(selectedPlatforms));

      const result = await createCampaignAction(user.id, formData);

      if (result.success) {
        toast.success("Campaign created successfully!");
        router.push("/dashboard/brand/campaigns");
        onSuccess?.();
      } else {
        toast.error("Failed to create campaign", result.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Campaign Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Provide basic information about your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Campaign Title *</label>
            <Input
              {...register("title")}
              placeholder="e.g. Tech Product Launch Campaign"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Campaign Type *</label>
            <Select
              value={watch("campaign_type")}
              onValueChange={(value) => setValue("campaign_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.campaign_type && (
              <p className="text-sm text-destructive mt-1">{errors.campaign_type.message as string}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description *</label>
            <Textarea
              {...register("description")}
              placeholder="Describe your campaign, goals, and what you're looking for..."
              rows={5}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message as string}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Budget & Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Budget & Timeline</CardTitle>
          <CardDescription>Set your budget and campaign deadline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Budget (NPR) *</label>
            <Input
              type="number"
              {...register("budget")}
              placeholder="e.g. 50000"
              min={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">Minimum: NPR 1,000</p>
            {errors.budget && (
              <p className="text-sm text-destructive mt-1">{errors.budget.message as string}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Application Deadline *</label>
            <Input
              type="date"
              {...register("deadline")}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.deadline && (
              <p className="text-sm text-destructive mt-1">{errors.deadline.message as string}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Platform Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Requirements</CardTitle>
          <CardDescription>Select the platforms where content should be created</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform.value}
                type="button"
                onClick={() => togglePlatform(platform.value)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedPlatforms.includes(platform.value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-input"
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>
          {selectedPlatforms.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">Select at least one platform</p>
          )}
        </CardContent>
      </Card>

      {/* Target Audience & Deliverables */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
          <CardDescription>Help creators understand your expectations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Audience</label>
            <Textarea
              {...register("target_audience")}
              placeholder="e.g. Young professionals aged 20-35 interested in technology..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Deliverables</label>
            <Textarea
              {...register("deliverables")}
              placeholder="List specific deliverables expected (e.g., 1 Instagram post, 3 stories, 1 Reel)..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Campaign"
          )}
        </Button>
      </div>
    </form>
  );
}