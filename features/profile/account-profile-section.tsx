import { getProfile } from "@/features/profile/profile-actions";
import ProfileForm from "@/features/profile/profile-form";

export async function AccountProfileSection() {
	const profile = await getProfile();

	return <ProfileForm profile={profile} />;
}
