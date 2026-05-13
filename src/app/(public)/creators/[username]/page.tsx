import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCreatorByUsernameAction } from "@/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

interface CreatorProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: CreatorProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const result = await getCreatorByUsernameAction(username);
  
  if (!result.success || !result.data?.creator) {
    return { title: "Creator Not Found" };
  }
  
  const creator = result.data.creator;
  return {
    title: `${creator.user?.full_name || creator.username} - Creator Profile`,
    description: creator.bio || `View ${creator.username}'s profile on SponsorNepal`,
  };
}

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const { username } = await params;
  const result = await getCreatorByUsernameAction(username);
  
  if (!result.success || !result.data?.creator) {
    notFound();
  }
  
  const creator = result.data.creator as any;
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalFollowers = (creator.instagram_followers || 0) + 
    (creator.tiktok_followers || 0) + 
    (creator.youtube_subscribers || 0);

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 via-violet-500/20 to-fuchsia-500/20">
        {creator.banner_url && (
          <img 
            src={creator.banner_url} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          <div className="relative">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-background shadow-xl">
              <AvatarImage src={creator.user?.avatar_url || ""} alt={creator.user?.full_name || ""} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-3xl font-bold">
                {creator.user?.full_name?.charAt(0) || creator.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {creator.user?.is_verified && (
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                {creator.user?.full_name || creator.username}
              </h1>
              {creator.niche && (
                <Badge variant="secondary">{creator.niche}</Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-2">@{creator.username}</p>
            {creator.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {creator.location}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" asChild>
              <Link href="/messages/new">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/campaigns">View Campaigns</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {formatNumber(totalFollowers)}
              </div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-500 mb-1">
                {formatNumber(creator.instagram_followers || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Instagram</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">
                {formatNumber(creator.youtube_subscribers || 0)}
              </div>
              <div className="text-sm text-muted-foreground">YouTube</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">
                {creator.engagement_rate ? `${creator.engagement_rate}%` : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="mb-8">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Bio</h3>
                    <p className="text-muted-foreground">
                      {creator.bio || "No bio available yet."}
                    </p>
                  </CardContent>
                </Card>

                {creator.previous_sponsors && creator.previous_sponsors.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Previous Sponsors</h3>
                      <div className="flex flex-wrap gap-2">
                        {creator.previous_sponsors.map((sponsor) => (
                          <Badge key={sponsor} variant="outline">
                            {sponsor}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Quick Info</h3>
                    <div className="space-y-3">
                      {creator.niche && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Niche</span>
                          <span className="font-medium">{creator.niche}</span>
                        </div>
                      )}
                      {creator.location && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location</span>
                          <span className="font-medium">{creator.location}</span>
                        </div>
                      )}
                      {creator.pricing_range && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pricing</span>
                          <span className="font-medium">{creator.pricing_range}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verified</span>
                        <span className="font-medium">
                          {creator.user?.is_verified ? "Yes" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {creator.languages && creator.languages.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {creator.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {creator.instagram_handle && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white">
                          <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Instagram</h3>
                        <p className="text-sm text-muted-foreground">{creator.instagram_handle}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatNumber(creator.instagram_followers || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </CardContent>
                </Card>
              )}

              {creator.youtube_channel && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white">
                          <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">YouTube</h3>
                        <p className="text-sm text-muted-foreground">{creator.youtube_channel}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatNumber(creator.youtube_subscribers || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                  </CardContent>
                </Card>
              )}

              {creator.tiktok_handle && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-gray-800 to-black rounded-xl">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white">
                          <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">TikTok</h3>
                        <p className="text-sm text-muted-foreground">{creator.tiktok_handle}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatNumber(creator.tiktok_followers || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            {creator.portfolio && creator.portfolio.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {creator.portfolio.map((item: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    {item.type === "image" && (
                      <img src={item.url} alt={item.caption || "Portfolio item"} className="w-full aspect-square object-cover" />
                    )}
                    {item.caption && (
                      <CardContent className="p-3">
                        <p className="text-sm">{item.caption}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold mb-2">No Portfolio Yet</h3>
                <p className="text-muted-foreground">
                  This creator hasn&apos;t added portfolio items yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}