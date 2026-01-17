import ProfileForm from "@/app/(dashboard)/account/components/profile-form";
import { createClient } from "@/utils/supabase/server";

export async function AccountProfileSection() {
	const supabase = await createClient();
	const { data: user } = await supabase.from("profile").select("*").single();

	return <ProfileForm user={user} />;
}
