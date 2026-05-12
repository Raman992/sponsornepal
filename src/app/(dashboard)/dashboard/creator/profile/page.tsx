import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreatorProfileForm } from "@/features/creators/components/creator-profile-form";

export default async function CreatorProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-8">
        {creatorProfile ? "Edit Profile" : "Create Your Profile"}
      </h1>
      <CreatorProfileForm initialData={creatorProfile} isEdit={!!creatorProfile} />
    </div>
  );
}