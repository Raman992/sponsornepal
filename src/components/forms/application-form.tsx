"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Send, DollarSign, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { applicationSchema } from "@/lib/validations/application";
import { applyToCampaignAction } from "@/actions/application.actions";
import { toast } from "@/store/ui-store";

interface ApplicationFormProps {
  campaignId: string;
  creatorId: string;
  campaignTitle: string;
  maxBudget?: number;
  onSuccess?: () => void;
}

export function ApplicationForm({
  campaignId,
  creatorId,
  campaignTitle,
  maxBudget,
  onSuccess,
}: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      proposal_message: "",
      expected_price: maxBudget || 0,
      delivery_timeline: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("proposal_message", data.proposal_message);
      formData.append("expected_price", data.expected_price.toString());
      formData.append("delivery_timeline", data.delivery_timeline);

      const result = await applyToCampaignAction(campaignId, creatorId, formData);

      if (result.success) {
        toast.success("Application submitted successfully!");
        onSuccess?.();
      } else {
        toast.error("Failed to submit application", result.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Apply to Campaign
          </CardTitle>
          <CardDescription>
            Submit your proposal for "{campaignTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Proposal Message */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposal Message *
              </label>
              <Textarea
                {...register("proposal_message")}
                placeholder="Introduce yourself and explain why you're perfect for this campaign. Highlight your relevant experience and how you plan to deliver results..."
                rows={6}
              />
              {errors.proposal_message && (
                <p className="text-sm text-destructive mt-1">
                  {errors.proposal_message.message as string}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 50 characters
              </p>
            </div>

            {/* Expected Price */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Expected Price (NPR) *
              </label>
              <Input
                type="number"
                {...register("expected_price")}
                placeholder="e.g. 30000"
                min={500}
                max={maxBudget || undefined}
              />
              {errors.expected_price && (
                <p className="text-sm text-destructive mt-1">
                  {errors.expected_price.message as string}
                </p>
              )}
              {maxBudget && (
                <p className="text-xs text-muted-foreground mt-1">
                  Campaign budget: NPR {maxBudget.toLocaleString()}
                </p>
              )}
            </div>

            {/* Delivery Timeline */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Delivery Timeline *
              </label>
              <Textarea
                {...register("delivery_timeline")}
                placeholder="Describe your delivery timeline (e.g., '1 Instagram post within 3 days of approval, story posts within 5 days')..."
                rows={3}
              />
              {errors.delivery_timeline && (
                <p className="text-sm text-destructive mt-1">
                  {errors.delivery_timeline.message as string}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}