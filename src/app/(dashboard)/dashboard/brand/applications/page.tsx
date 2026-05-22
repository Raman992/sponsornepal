"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  MessageSquare,
  DollarSign,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { toast } from "@/store/ui-store";

interface Application {
  id: string;
  campaignId: string;
  campaignTitle: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string | null;
  creatorNiche: string;
  creatorFollowers: number;
  proposalMessage: string;
  expectedPrice: number;
  deliveryTimeline: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

export default function BrandApplicationsPage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [brandNote, setBrandNote] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      setTimeout(() => {
        setApplications([
          {
            id: "1",
            campaignId: "1",
            campaignTitle: "Tech Product Launch",
            creatorName: "Rajesh Hamal",
            creatorUsername: "rajesh_tech",
            creatorAvatar: null,
            creatorNiche: "Technology",
            creatorFollowers: 45000,
            proposalMessage: "Hi! I'm a tech content creator with over 45K followers on Instagram. I've reviewed similar products in the past and my audience loves engaging with tech content. I can create a detailed review video, Instagram post, and stories showcasing your product's features.",
            expectedPrice: 35000,
            deliveryTimeline: "Instagram post within 3 days, story within 5 days, YouTube review within 7 days",
            status: "pending",
            createdAt: "2024-01-15",
          },
          {
            id: "2",
            campaignId: "1",
            campaignTitle: "Tech Product Launch",
            creatorName: "Sita Sharma",
            creatorUsername: "sita_reviews",
            creatorAvatar: null,
            creatorNiche: "Lifestyle",
            creatorFollowers: 30000,
            proposalMessage: "I specialize in lifestyle and tech content. My audience is primarily 18-35 year olds who are interested in the latest gadgets. I can create authentic content that resonates with my followers.",
            expectedPrice: 25000,
            deliveryTimeline: "Instagram reel within 5 days, 3 story posts within 7 days",
            status: "pending",
            createdAt: "2024-01-16",
          },
          {
            id: "3",
            campaignId: "2",
            campaignTitle: "Fashion Brand Collaboration",
            creatorName: "Anita Magar",
            creatorUsername: "anita_fashion",
            creatorAvatar: null,
            creatorNiche: "Fashion",
            creatorFollowers: 60000,
            proposalMessage: "Fashion is my passion! I have a strong following in the fashion space and would love to showcase your spring collection. I can create outfit reels, styling tips, and behind-the-scenes content.",
            expectedPrice: 45000,
            deliveryTimeline: "2 Instagram reels within 7 days, 5 story posts within 10 days",
            status: "accepted",
            createdAt: "2024-01-10",
          },
        ]);
        setIsLoading(false);
      }, 500);
    };

    loadApplications();
  }, []);

  const handleUpdateStatus = async (applicationId: string, status: "accepted" | "rejected") => {
    if (!user) return;

    setIsUpdating(true);
    setTimeout(() => {
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
      setSelectedApplication(null);
      toast.success(`Application ${status} successfully!`);
      setIsUpdating(false);
    }, 1000);
  };

  const pendingApplications = applications.filter((app) => app.status === "pending");
  const otherApplications = applications.filter((app) => app.status !== "pending");

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
            <div className="flex items-center gap-4">
              <Link href="/dashboard/brand/campaigns">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Applications</h1>
                <p className="text-sm text-muted-foreground">Review creator applications</p>
              </div>
            </div>
            <Badge variant="secondary">
              {pendingApplications.length} pending
            </Badge>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground">
                Applications will appear here when creators apply to your campaigns
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {pendingApplications.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
                  <div className="space-y-4">
                    {pendingApplications.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover-lift">
                          <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={app.creatorAvatar || undefined} />
                                    <AvatarFallback>
                                      {app.creatorName.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold">{app.creatorName}</h3>
                                      <Badge variant="secondary">@{app.creatorUsername}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Applied to: <Link href={`/dashboard/brand/campaigns/${app.campaignId}`} className="text-primary hover:underline">{app.campaignTitle}</Link>
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                      <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {app.creatorNiche}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        NPR {app.expectedPrice.toLocaleString()}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(app.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {app.proposalMessage}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus(app.id, "accepted")}
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleUpdateStatus(app.id, "rejected")}
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <X className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedApplication(app)}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {otherApplications.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Other Applications</h2>
                  <div className="space-y-4">
                    {otherApplications.map((app) => (
                      <Card key={app.id} className="opacity-75">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={app.creatorAvatar || undefined} />
                                <AvatarFallback>
                                  {app.creatorName.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{app.creatorName}</h3>
                                <p className="text-sm text-muted-foreground">{app.campaignTitle}</p>
                              </div>
                            </div>
                            <Badge
                              className={
                                app.status === "accepted"
                                  ? "bg-green-500/10 text-green-600"
                                  : app.status === "rejected"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-gray-500/10 text-gray-600"
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedApplication && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>
                      {selectedApplication.creatorName} applied to {selectedApplication.campaignTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedApplication.creatorAvatar || undefined} />
                        <AvatarFallback className="text-lg">
                          {selectedApplication.creatorName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedApplication.creatorName}</h3>
                        <p className="text-muted-foreground">@{selectedApplication.creatorUsername}</p>
                        <p className="text-sm text-muted-foreground">{selectedApplication.creatorNiche} • {selectedApplication.creatorFollowers.toLocaleString()} followers</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Proposal Message</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{selectedApplication.proposalMessage}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Expected Price</h4>
                        <p className="text-2xl font-bold">NPR {selectedApplication.expectedPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Delivery Timeline</h4>
                        <p className="text-muted-foreground">{selectedApplication.deliveryTimeline}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Note to Creator (optional)</h4>
                      <Textarea
                        placeholder="Add a note..."
                        value={brandNote}
                        onChange={(e) => setBrandNote(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                        Close
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(selectedApplication.id, "rejected")}
                        disabled={isUpdating}
                      >
                        Reject
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateStatus(selectedApplication.id, "accepted")}
                        disabled={isUpdating}
                      >
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
