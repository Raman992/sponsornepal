"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Save,
  Camera,
  MapPin,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { creatorProfileSchema } from "@/lib/validations/creator";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { updateCreatorProfileAction } from "@/actions/creator.actions";
import { toast } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const niches = [
  { value: "tech", label: "Tech & Gadgets" },
  { value: "fashion", label: "Fashion & Lifestyle" },
  { value: "food", label: "Food & Dining" },
  { value: "travel", label: "Travel & Tourism" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "gaming", label: "Gaming" },
  { value: "finance", label: "Finance & Business" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
];

export default function CreatorProfilePage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Record<string, string | number | null> | null>(null);

  const form = useForm({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      username: "",
      bio: "",
      niche: "",
      location: "",
      instagram_handle: "",
      tiktok_handle: "",
      youtube_channel: "",
      pricing_range: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setProfile({
          username: "creative_nepali",
          bio: "Tech enthusiast and content creator based in Kathmandu. I love reviewing gadgets, exploring new tech, and sharing my experiences with my amazing followers.",
          niche: "tech",
          location: "Kathmandu, Nepal",
          instagram_handle: "creative_nepali",
          tiktok_handle: "@creative_nepali",
          youtube_channel: "Creative Nepali",
          pricing_range: "NPR 25,000 - 50,000",
          instagram_followers: 45000,
          tiktok_followers: 30000,
          youtube_subscribers: 25000,
          engagement_rate: 5.8,
        });
        form.reset({
          username: "creative_nepali",
          bio: "Tech enthusiast and content creator based in Kathmandu. I love reviewing gadgets, exploring new tech, and sharing my experiences with my amazing followers.",
          niche: "tech",
          location: "Kathmandu, Nepal",
          instagram_handle: "creative_nepali",
          tiktok_handle: "@creative_nepali",
          youtube_channel: "Creative Nepali",
          pricing_range: "NPR 25,000 - 50,000",
        });
        setIsLoading(false);
      }, 500);
    };

    loadProfile();
  }, [form]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] || "");
      });

      const result = await updateCreatorProfileAction(user.id, formData);
      
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

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "C";

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
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your creator profile</p>
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
            {/* Left Column - Profile Preview */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    {/* Avatar Section */}
                    <div className="relative mb-6">
                      <div className="w-full h-32 rounded-xl bg-gradient-to-r from-primary/20 to-violet-500/20" />
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <div className="relative">
                          <Avatar className="h-24 w-24 ring-4 ring-background">
                            <AvatarImage src={user?.avatar_url || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-2xl font-bold">
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
                      <h2 className="text-xl font-bold">{user?.full_name || "Creator"}</h2>
                      <p className="text-muted-foreground">@{profile?.username}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        {profile?.niche && (
                          <Badge variant="secondary">{niches.find(n => n.value === profile.niche)?.label}</Badge>
                        )}
                        {user?.is_verified && (
                          <Badge className="bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Social Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{profile?.instagram_followers?.toLocaleString() || 0}</div>
                        <div className="text-xs text-muted-foreground">Instagram</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{profile?.tiktok_followers?.toLocaleString() || 0}</div>
                        <div className="text-xs text-muted-foreground">TikTok</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{profile?.youtube_subscribers?.toLocaleString() || 0}</div>
                        <div className="text-xs text-muted-foreground">YouTube</div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                      <div className="text-2xl font-bold text-emerald-600">{profile?.engagement_rate || 0}%</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Profile Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your creator profile details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Username</label>
                          <Input
                            {...form.register("username")}
                            placeholder="your_username"
                            prefix="@"
                          />
                          {form.formState.errors.username && (
                            <p className="text-sm text-destructive mt-1">{form.formState.errors.username.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Niche</label>
                          <Select
                            value={form.watch("niche")}
                            onValueChange={(value) => form.setValue("niche", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your niche" />
                            </SelectTrigger>
                            <SelectContent>
                              {niches.map((niche) => (
                                <SelectItem key={niche.value} value={niche.value}>
                                  {niche.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Bio</label>
                        <Textarea
                          {...form.register("bio")}
                          placeholder="Tell brands about yourself..."
                          rows={4}
                        />
                        {form.formState.errors.bio && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.bio.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...form.register("location")}
                            placeholder="Kathmandu, Nepal"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Pricing Range</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...form.register("pricing_range")}
                            placeholder="NPR 25,000 - 50,000"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4">Social Media Handles</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Instagram Handle
                            </label>
                            <Input
                              {...form.register("instagram_handle")}
                              placeholder="your_username"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              TikTok Handle
                            </label>
                            <Input
                              {...form.register("tiktok_handle")}
                              placeholder="@your_username"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              YouTube Channel
                            </label>
                            <Input
                              {...form.register("youtube_channel")}
                              placeholder="Your Channel Name"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Social Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Social Metrics</CardTitle>
                    <CardDescription>Update your follower counts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          Instagram Followers
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          defaultValue={profile?.instagram_followers}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          TikTok Followers
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          defaultValue={profile?.tiktok_followers}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          YouTube Subscribers
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          defaultValue={profile?.youtube_subscribers}
                        />
                      </div>
                    </div>
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