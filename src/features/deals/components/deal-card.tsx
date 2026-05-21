import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign, Calendar, User, Building2 } from "lucide-react";

interface DealCardProps {
  deal: {
    id: string;
    campaignTitle: string;
    creatorName: string;
    brandName: string;
    agreedAmount: number | null;
    status: "pending" | "active" | "completed" | "cancelled";
    createdAt: string;
  };
  variant?: "default" | "compact";
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  active: "bg-blue-500/10 text-blue-600",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export function DealCard({ deal, variant = "default" }: DealCardProps) {
  if (variant === "compact") {
    return (
      <Card className="hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">{deal.campaignTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {deal.creatorName} • {deal.brandName}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">
                {deal.agreedAmount ? `NPR ${deal.agreedAmount.toLocaleString()}` : "N/A"}
              </p>
              <Badge className={cn("text-xs", statusColors[deal.status])}>
                {deal.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{deal.campaignTitle}</h3>
              <Badge className={statusColors[deal.status]}>
                {deal.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {deal.creatorName}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {deal.brandName}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">
              {deal.agreedAmount ? `NPR ${deal.agreedAmount.toLocaleString()}` : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(deal.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
