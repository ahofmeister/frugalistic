import { getApiKeys } from "@/components/api/api-key-actions";
import { ApiKeyManager } from "@/components/api/api-key-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function AccountApiKeys() {
	const keys = await getApiKeys();

	return (
		<Card>
			<CardHeader>
				<CardTitle>API Keys</CardTitle>
				<CardDescription>Add API keys for the API (eg import)</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<ApiKeyManager initialKeys={keys} />
			</CardContent>
		</Card>
	);
}
