import type { NextRequest } from "next/server";
import { withApiAuth } from "@/components/api/api-utils";

export const GET = withApiAuth(async (request: NextRequest) => {
	return Response.json({ message: "OK" }, { status: 200 });
});
