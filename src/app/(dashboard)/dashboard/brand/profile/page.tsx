"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Camera, Globe, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { updateBrandProfileAction, getBrandProfileAction } from "@/actions/brand.actions";
import { cn } from "@/lib/utils";
import { toast } from "@/store/ui-store";

const industries = [
  { value: "technology", label: "Technology" },
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "food", label: "Food & Beverage" },
  { value: "travel", label: "Travel & Tourism" },
  { value: "health", label: "Health & Wellness" },
  { value: "beauty", label: "Beauty & Cosmetics" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance & Banking" },
  { value: "entertainment", label: "Entertainment" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "automotive", label: "Automotive" },
  { value: "real-estate", label: "Real Estate" },
];

export default function BrandProfilePage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Record<string, string | null> | null>(null);

  const form = useForm({
    resolver: zodResolver(require("@/lib/validations/brand").brandProfileSchema),
    defaultValues: {
      company_name: "",
      website: "",
      industry: "",
      description: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setIsLoading(true);
      const result = await getBrandProfileAction(user.id);

      if (result.success && result.data) {
        const data = result.data as Record<string, string | null>;
        setProfile(data);
        form.reset({
          company_name: data.company_name || "",
          website: data.website || "",
          industry: data.industry || "",
          description: data.description || "",
        });
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [user, form]);

  const onSubmit = async (data: any) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] || "");
      });

      const result = await updateBrandProfileAction(user.id, formData);

      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile", result.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = profile?.company_name
    ? profile.company_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "B";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <div className={cn("transition-all duration-300", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
          <div className="p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-48 bg-muted rounded-2xl" />
              <div className="h-96 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">Brand Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your brand information</p>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
              {isSaving ? (
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
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="relative mb-6">
                      <div className="w-full h-32 rounded-xl bg-gradient-to-r from-primary/20 to-neutral-500/20" />
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <div className="relative">
                          <Avatar className="h-24 w-24 ring-4 ring-background">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-neutral-600 text-white text-2xl font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-16 mb-6">
                      <h2 className="text-xl font-bold">{profile?.company_name || "Your Brand"}</h2>
                      {profile?.industry && (
                        <p className="text-muted-foreground">{profile.industry}</p>
                      )}
                    </div>

                    {profile?.website && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Information</CardTitle>
                    <CardDescription>Update your brand details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...form.register("company_name")}
                            placeholder="Your company name"
                            className="pl-10"
                          />
                        </div>
                        {form.formState.errors.company_name && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.company_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...form.register("website")}
                            placeholder="https://yourcompany.com"
                            className="pl-10"
                          />
                        </div>
                        {form.formState.errors.website && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.website.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Industry</label>
                        <select
                          {...form.register("industry")}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select your industry</option>
                          {industries.map((industry) => (
                            <option key={industry.value} value={industry.value}>
                              {industry.label}
                            </option>
                          ))}
                        </select>
                        {form.formState.errors.industry && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.industry.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          {...form.register("description")}
                          placeholder="Tell creators about your brand..."
                          rows={4}
                        />
                        {form.formState.errors.description && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
