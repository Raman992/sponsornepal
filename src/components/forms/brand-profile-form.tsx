"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Building2, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { brandProfileSchema, type BrandProfileFormData } from "@/lib/validations/brand";
import { brandService } from "@/services/brand.service";
import { revalidatePath } from "next/cache";
import type { BrandProfile } from "@/types";

const INDUSTRY_OPTIONS = [
  "Technology",
  "E-commerce",
  "Food & Beverage",
  "Fashion & Apparel",
  "Healthcare",
  "Education",
  "Finance & Banking",
  "Telecommunications",
  "Travel & Tourism",
  "Automotive",
  "Real Estate",
  "Media & Entertainment",
  "Manufacturing",
  "Retail",
  "Other",
];

interface BrandProfileFormProps {
  profile: BrandProfile | null;
  userId: string;
}

export function BrandProfileForm({ profile, userId }: BrandProfileFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BrandProfileFormData>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      company_name: profile?.company_name || "",
      website: profile?.website || "",
      industry: profile?.industry || "",
      description: profile?.description || "",
    },
  });

  const onSubmit = async (data: BrandProfileFormData) => {
    setIsSubmitting(true);
    try {
      const result = await brandService.updateBrandProfile(userId, {
        company_name: data.company_name,
        website: data.website || null,
        industry: data.industry || null,
        description: data.description || null,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Profile updated",
        description: "Your brand profile has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              placeholder="Your Company Pvt. Ltd."
              {...register("company_name")}
            />
            {errors.company_name && (
              <p className="text-sm text-destructive">{errors.company_name.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://yourcompany.com"
                {...register("website")}
              />
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <select
                id="industry"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("industry")}
              >
                <option value="">Select industry</option>
                {INDUSTRY_OPTIONS.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Company Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell creators about your company and what you do..."
              rows={5}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? (
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
