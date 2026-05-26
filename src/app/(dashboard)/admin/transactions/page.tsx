"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  dealId: string;
  creatorName: string;
  brandName: string;
  amount: number;
  status: "pending" | "released" | "refunded";
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const { sidebarOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions] = useState<Transaction[]>([
    { id: "1", dealId: "1", creatorName: "Rajesh Hamal", brandName: "Tech Brand Co", amount: 35000, status: "released", createdAt: "2024-01-15" },
    { id: "2", dealId: "2", creatorName: "Sita Sharma", brandName: "Fashion House", amount: 25000, status: "pending", createdAt: "2024-01-16" },
    { id: "3", dealId: "3", creatorName: "Anita Magar", brandName: "Foodmandu", amount: 45000, status: "released", createdAt: "2024-01-10" },
  ]);

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);
  const releasedAmount = transactions.filter((t) => t.status === "released").reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-lg font-semibold">Transactions</h1>
              <p className="text-sm text-muted-foreground">Monitor platform transactions</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {[
              { label: "Total Volume", value: `NPR ${totalAmount.toLocaleString()}`, icon: DollarSign },
              { label: "Pending", value: `NPR ${pendingAmount.toLocaleString()}`, icon: TrendingUp },
              { label: "Released", value: `NPR ${releasedAmount.toLocaleString()}`, icon: DollarSign },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All platform transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">NPR {transaction.amount.toLocaleString()}</h3>
                        <Badge
                          className={
                            transaction.status === "released"
                              ? "bg-green-500/10 text-green-600"
                              : transaction.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-600"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.creatorName} ← {transaction.brandName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
