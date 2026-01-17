import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalize } from "@/lib/utils";
import type { TransactionType } from "@/types";
import { createClient } from "@/utils/supabase/server";

type TotalSum = {
	sum: number;
};

export async function TotalTransactionAmount(props: { type: TransactionType }) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("transactions")
		.select("amount.sum()")
		.eq("type", props.type)
		.returns<TotalSum[]>()
		.single();

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="text-xl">Total {capitalize(props.type)}</div>
				</CardTitle>
			</CardHeader>
			<CardFooter>
				<TransactionAmount amount={data?.sum ?? 0} type={props.type} />{" "}
			</CardFooter>
		</Card>
	);
}
