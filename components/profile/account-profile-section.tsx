import { getProfile } from "@/components/profile/profile-actions";
import ProfileForm from "@/components/profile/profile-form";

export async function AccountProfileSection() {
	const profile = await getProfile();

	return <ProfileForm profile={profile} />;
}
