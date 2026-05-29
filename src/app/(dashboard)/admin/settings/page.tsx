"use client";

import {
  Settings,
  Globe,
  Shield,
  Database,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { sidebarOpen } = useUIStore();

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
          <div className="flex h-16 items-center px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground">Platform configuration</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform
                </CardTitle>
                <CardDescription>General platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Platform Name</span>
                  <span className="text-sm font-medium">SponsorNepal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">URL</span>
                  <span className="text-sm font-medium">{process.env.NEXT_PUBLIC_APP_URL || "sponsornepal.com"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-500/10 text-green-600">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auth Provider</span>
                  <span className="text-sm font-medium">Supabase Auth</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Row Level Security</span>
                  <Badge className="bg-green-500/10 text-green-600">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google OAuth</span>
                  <Badge className="bg-green-500/10 text-green-600">Configured</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database
                </CardTitle>
                <CardDescription>Database configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Provider</span>
                  <span className="text-sm font-medium">Supabase (PostgreSQL)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Realtime</span>
                  <Badge className="bg-green-500/10 text-green-600">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage</span>
                  <Badge className="bg-green-500/10 text-green-600">Configured</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
                <CardDescription>Email service configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Provider</span>
                  <span className="text-sm font-medium">Resend</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="outline">Pending Setup</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">From Email</span>
                  <span className="text-sm font-medium text-muted-foreground">Not configured</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
