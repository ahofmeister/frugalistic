import ProfileForm from "@/app/(dashboard)/account/components/profile-form";
import { dbTransaction } from "@/drizzle/client";

export async function AccountProfileSection() {
	const profile = await dbTransaction((tx) => {
		return tx.query.profiles.findFirst();
	});

	return <ProfileForm profile={profile} />;
}
