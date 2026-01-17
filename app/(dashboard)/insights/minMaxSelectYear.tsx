import SelectYear from "@/app/(dashboard)/insights/select-year";
import { createClient } from "@/utils/supabase/server";

export async function MinMaxSelectYear() {
	type YearRange = {
		minyear: number;
		maxyear: number;
	};

	const supabase = await createClient();
	const { data: yearRange } = await supabase
		.rpc("get_min_and_max_year")
		.select("*")
		.returns<YearRange[]>()
		.single();

	return <SelectYear min={yearRange?.minyear} max={yearRange?.maxyear} />;
}
